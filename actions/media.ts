"use server";

import { v2 as cloudinary } from "cloudinary";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const SUPER_ADMIN = USER_ROLES.SUPER_ADMIN;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function getMediaLibrary() {
  await requireRole(SUPER_ADMIN);

  const media = await prisma.media.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return media.map((item) => ({
    id: item.id,
    fileName: item.fileName,
    originalFileName: item.originalFileName,
    mimeType: item.mimeType,
    extension: item.extension,
    path: item.path,
    url: item.url,
    type: item.type,
    size: item.size.toString(),
    width: item.width,
    height: item.height,
    createdAt: item.createdAt,
  }));
}

export async function getMediaStatistics() {
  await requireRole(SUPER_ADMIN);

  const [total, images, videos, documents] =
    await Promise.all([
      prisma.media.count(),

      prisma.media.count({
        where: {
          type: "IMAGE",
        },
      }),

      prisma.media.count({
        where: {
          type: "VIDEO",
        },
      }),

      prisma.media.count({
        where: {
          type: "DOCUMENT",
        },
      }),
    ]);

  return {
    total,
    images,
    videos,
    documents,
  };
}

export async function uploadMedia(file: File) {
  const user = await requireRole(SUPER_ADMIN);

  if (!file || file.size === 0) {
    throw new Error("No image was provided.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG, WEBP, and GIF images are supported.",
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    bytes: number;
    width?: number;
    height?: number;
    format?: string;
  }>((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "elite-battlegrounds/media",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(
              error ??
                new Error(
                  "Cloudinary upload failed.",
                ),
            );
            return;
          }

          resolve(result);
        },
      );

    uploadStream.end(buffer);
  });

  const extension = result.format ?? "jpg";

  const media = await prisma.media.create({
    data: {
      fileName: `${result.public_id}.${extension}`,
      originalFileName: file.name,
      mimeType: file.type,
      extension,
      path: result.public_id,
      url: result.secure_url,
      type: "IMAGE",
      size: BigInt(result.bytes),
      width: result.width ?? null,
      height: result.height ?? null,
      uploadedById: user.id,
    },
  });

  return {
    id: media.id,
    url: media.url,
    fileName: media.originalFileName,
  };
}