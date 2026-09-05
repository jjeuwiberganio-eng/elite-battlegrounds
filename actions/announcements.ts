"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const SUPER_ADMIN = USER_ROLES.SUPER_ADMIN;

/*
|--------------------------------------------------------------------------
| Public: Active Announcement
|--------------------------------------------------------------------------
*/

export interface ActiveAnnouncement {
  id: string;
  title: string;
  summary: string | null;
}

export async function getActiveAnnouncement(): Promise<ActiveAnnouncement | null> {
  const announcement =
    await prisma.announcement.findFirst({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

  if (!announcement) {
    return null;
  }

  return {
    id: announcement.id,
    title: announcement.title,
    summary: announcement.summary,
  };
}

/*
|--------------------------------------------------------------------------
| Admin: Announcements CRUD
|--------------------------------------------------------------------------
*/

export interface AdminAnnouncement {
  id: string;
  title: string;
  summary: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
}

export async function getAnnouncements(): Promise<
  AdminAnnouncement[]
> {
  await requireRole(SUPER_ADMIN);

  const announcements =
    await prisma.announcement.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return announcements.map(
    (announcement) => ({
      id: announcement.id,
      title: announcement.title,
      summary: announcement.summary,
      status: announcement.status,
      publishedAt:
        announcement.publishedAt?.toISOString() ??
        null,
      createdAt:
        announcement.createdAt.toISOString(),
    }),
  );
}

function slugify(title: string) {
  return `${title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${Date.now()}`;
}

export async function createAnnouncement(data: {
  title: string;
  summary?: string;
}) {
  const user = await requireRole(SUPER_ADMIN);

  const title = data.title.trim();

  if (!title) {
    throw new Error(
      "Announcement text is required.",
    );
  }

  await prisma.announcement.create({
    data: {
      title,
      slug: slugify(title),
      summary:
        data.summary?.trim() || null,
      content: title,
      status: "DRAFT",
      createdById: user.id,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Announcement created.",
  };
}

export async function updateAnnouncementStatus(
  announcementId: string,
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
) {
  await requireRole(SUPER_ADMIN);

  await prisma.announcement.update({
    where: {
      id: announcementId,
    },
    data: {
      status,
      publishedAt:
        status === "PUBLISHED"
          ? new Date()
          : undefined,
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Status updated.",
  };
}

export async function deleteAnnouncement(
  announcementId: string,
) {
  await requireRole(SUPER_ADMIN);

  await prisma.announcement.update({
    where: {
      id: announcementId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Announcement deleted.",
  };
}
