"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const SUPER_ADMIN = USER_ROLES.SUPER_ADMIN;

/*
 * Cloudinary video URLs can be requested with a .jpg extension to
 * get an auto-generated thumbnail frame instead of the video file
 * itself - this is how a VIDEO highlight gets a poster image
 * without a separate thumbnail upload.
 */
function getVideoThumbnailUrl(
  videoUrl: string,
) {
  return videoUrl.replace(
    /\.[a-zA-Z0-9]+$/,
    ".jpg",
  );
}

/*
|--------------------------------------------------------------------------
| Public: Homepage Highlights
|--------------------------------------------------------------------------
*/

export interface HighlightData {
  id: string;
  title: string;
  image: string;
  type: "poster" | "video";
  url: string;
}

export async function getHomepageHighlights(): Promise<
  HighlightData[]
> {
  const highlights =
    await prisma.highlight.findMany({
      orderBy: [
        { featured: "desc" },
        { displayOrder: "asc" },
      ],
      include: {
        media: true,
      },
    });

  return highlights.map((highlight) => {
    const isVideo =
      highlight.type === "VIDEO";

    return {
      id: highlight.id,
      title: highlight.title,
      image: isVideo
        ? getVideoThumbnailUrl(
            highlight.media.url,
          )
        : highlight.media.url,
      type: isVideo
        ? ("video" as const)
        : ("poster" as const),
      url: isVideo
        ? highlight.media.url
        : "#",
    };
  });
}

/*
|--------------------------------------------------------------------------
| Admin: Highlights CRUD
|--------------------------------------------------------------------------
*/

export interface AdminHighlight {
  id: string;
  title: string;
  type: "POSTER" | "VIDEO";
  displayOrder: number;
  featured: boolean;
  thumbnailUrl: string;
  mediaUrl: string;
}

export async function getHighlights(): Promise<
  AdminHighlight[]
> {
  await requireRole(SUPER_ADMIN);

  const highlights =
    await prisma.highlight.findMany({
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        media: true,
      },
    });

  return highlights.map((highlight) => ({
    id: highlight.id,
    title: highlight.title,
    type: highlight.type,
    displayOrder:
      highlight.displayOrder,
    featured: highlight.featured,
    thumbnailUrl:
      highlight.type === "VIDEO"
        ? getVideoThumbnailUrl(
            highlight.media.url,
          )
        : highlight.media.url,
    mediaUrl: highlight.media.url,
  }));
}

export interface HighlightStatistics {
  total: number;
  posters: number;
  videos: number;
  featured: number;
}

export async function getHighlightStatistics(): Promise<HighlightStatistics> {
  await requireRole(SUPER_ADMIN);

  const [total, posters, videos, featured] =
    await Promise.all([
      prisma.highlight.count(),
      prisma.highlight.count({
        where: {
          type: "POSTER",
        },
      }),
      prisma.highlight.count({
        where: {
          type: "VIDEO",
        },
      }),
      prisma.highlight.count({
        where: {
          featured: true,
        },
      }),
    ]);

  return {
    total,
    posters,
    videos,
    featured,
  };
}

export async function createHighlight(data: {
  title: string;
  type: "POSTER" | "VIDEO";
  mediaId: string;
  featured?: boolean;
}) {
  const user = await requireRole(SUPER_ADMIN);

  const title = data.title.trim();

  if (!title) {
    throw new Error(
      "Title is required.",
    );
  }

  if (!data.mediaId) {
    throw new Error(
      "An uploaded image or video is required.",
    );
  }

  const highest =
    await prisma.highlight.findFirst({
      orderBy: {
        displayOrder: "desc",
      },
    });

  const nextOrder =
    (highest?.displayOrder ?? 0) + 1;

  await prisma.highlight.create({
    data: {
      title,
      type: data.type,
      mediaId: data.mediaId,
      featured: Boolean(
        data.featured,
      ),
      displayOrder: nextOrder,
      createdById: user.id,
    },
  });

  revalidatePath("/admin/highlights");
  revalidatePath("/");

  return {
    success: true,
    message: `${title} added.`,
  };
}

export async function updateHighlight(data: {
  highlightId: string;
  title: string;
  featured?: boolean;
}) {
  await requireRole(SUPER_ADMIN);

  const title = data.title.trim();

  if (!title) {
    throw new Error(
      "Title is required.",
    );
  }

  await prisma.highlight.update({
    where: {
      id: data.highlightId,
    },
    data: {
      title,
      featured: Boolean(
        data.featured,
      ),
    },
  });

  revalidatePath("/admin/highlights");
  revalidatePath("/");

  return {
    success: true,
    message: "Highlight updated.",
  };
}

export async function deleteHighlight(
  highlightId: string,
) {
  await requireRole(SUPER_ADMIN);

  await prisma.highlight.delete({
    where: {
      id: highlightId,
    },
  });

  revalidatePath("/admin/highlights");
  revalidatePath("/");

  return {
    success: true,
    message: "Highlight deleted.",
  };
}

export async function moveHighlight(
  highlightId: string,
  direction: "up" | "down",
) {
  await requireRole(SUPER_ADMIN);

  const highlights =
    await prisma.highlight.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });

  const index = highlights.findIndex(
    (highlight) =>
      highlight.id === highlightId,
  );

  if (index === -1) {
    throw new Error(
      "Highlight not found.",
    );
  }

  const swapIndex =
    direction === "up"
      ? index - 1
      : index + 1;

  if (
    swapIndex < 0 ||
    swapIndex >= highlights.length
  ) {
    return {
      success: true,
      message: "Already at the edge.",
    };
  }

  const current = highlights[index];
  const swapWith = highlights[swapIndex];

  await prisma.$transaction([
    prisma.highlight.update({
      where: {
        id: current.id,
      },
      data: {
        displayOrder:
          swapWith.displayOrder,
      },
    }),
    prisma.highlight.update({
      where: {
        id: swapWith.id,
      },
      data: {
        displayOrder:
          current.displayOrder,
      },
    }),
  ]);

  revalidatePath("/admin/highlights");
  revalidatePath("/");

  return {
    success: true,
    message: "Reordered.",
  };
}