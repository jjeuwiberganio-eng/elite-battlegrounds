import { PrismaClient, UserStatus, SettingDataType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ROLES = [
  {
    name: "Super Administrator",
    slug: "super-admin",
    description: "Full system access.",
    isSystem: true,
  },
  {
    name: "Administrator",
    slug: "admin",
    description: "Manages the platform.",
    isSystem: true,
  },
  {
    name: "Organizer",
    slug: "organizer",
    description: "Creates and manages tournaments.",
    isSystem: true,
  },
  {
    name: "Referee",
    slug: "referee",
    description: "Handles match officiating.",
    isSystem: true,
  },
  {
    name: "Moderator",
    slug: "moderator",
    description: "Moderates community content.",
    isSystem: true,
  },
];



const PERMISSIONS = [
  // Dashboard
  {
    name: "View Dashboard",
    slug: "dashboard.view",
    category: "Dashboard",
    description: "Access the admin dashboard.",
  },

  // User Management
  {
    name: "View Users",
    slug: "users.view",
    category: "Users",
    description: "View user accounts.",
  },
  {
    name: "Manage Users",
    slug: "users.manage",
    category: "Users",
    description: "Create, update and delete users.",
  },

  // Roles & Permissions
  {
    name: "View Roles",
    slug: "roles.view",
    category: "RBAC",
    description: "View system roles.",
  },
  {
    name: "Manage Roles",
    slug: "roles.manage",
    category: "RBAC",
    description: "Manage roles.",
  },
  {
    name: "Manage Permissions",
    slug: "permissions.manage",
    category: "RBAC",
    description: "Manage permissions.",
  },

  // Seasons
  {
    name: "Manage Seasons",
    slug: "seasons.manage",
    category: "Tournament",
    description: "Create and manage seasons.",
  },

  // Tournaments
  {
    name: "Manage Tournaments",
    slug: "tournaments.manage",
    category: "Tournament",
    description: "Create and manage tournaments.",
  },

  // Teams
  {
    name: "Manage Teams",
    slug: "teams.manage",
    category: "Tournament",
    description: "Manage teams.",
  },

  // Matches
  {
    name: "Manage Matches",
    slug: "matches.manage",
    category: "Tournament",
    description: "Create and manage matches.",
  },

  // Standings
  {
    name: "Manage Standings",
    slug: "standings.manage",
    category: "Tournament",
    description: "Manage standings.",
  },

  // Rules
  {
    name: "Manage Rules",
    slug: "rules.manage",
    category: "Content",
    description: "Manage tournament rules.",
  },

  // Announcements
  {
    name: "Manage Announcements",
    slug: "announcements.manage",
    category: "Content",
    description: "Manage announcements.",
  },

  // Sponsors
  {
    name: "Manage Sponsors",
    slug: "sponsors.manage",
    category: "Content",
    description: "Manage sponsors.",
  },

  // Pages
  {
    name: "Manage Pages",
    slug: "pages.manage",
    category: "Content",
    description: "Manage static pages.",
  },

  // Settings
  {
    name: "Manage Settings",
    slug: "settings.manage",
    category: "System",
    description: "Manage application settings.",
  },
];

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  "super-admin": ["*"],

  admin: [
    "dashboard.view",
    "users.view",
    "users.manage",
    "roles.view",
    "seasons.manage",
    "tournaments.manage",
    "teams.manage",
    "matches.manage",
    "standings.manage",
    "rules.manage",
    "announcements.manage",
    "sponsors.manage",
    "pages.manage",
    "settings.manage",
  ],

  organizer: [
    "dashboard.view",
    "seasons.manage",
    "tournaments.manage",
    "teams.manage",
    "matches.manage",
    "standings.manage",
    "rules.manage",
    "announcements.manage",
  ],

  referee: [
    "dashboard.view",
    "matches.manage",
    "standings.manage",
  ],

  moderator: [
    "dashboard.view",
    "announcements.manage",
    "pages.manage",
  ],
};

const DEFAULT_SETTINGS = [
  {
    key: "site.name",
    name: "Site Name",
    value: "Elite Battlegrounds",
    dataType: "STRING",
    category: "General",
    isEditable: true,
    isSystem: true,
  },
  {
    key: "site.tagline",
    name: "Site Tagline",
    value: "Competitive Esports Tournament Platform",
    dataType: "STRING",
    category: "General",
    isEditable: true,
    isSystem: true,
  },
  {
    key: "registration.enabled",
    name: "Registration Enabled",
    value: true,
    dataType: "BOOLEAN",
    category: "Tournament",
    isEditable: true,
    isSystem: true,
  },
  {
    key: "maintenance.mode",
    name: "Maintenance Mode",
    value: false,
    dataType: "BOOLEAN",
    category: "System",
    isEditable: true,
    isSystem: true,
  },
];

async function main() {
  console.log("🌱 Starting Elite Battlegrounds seed...");

    console.log("📦 Seeding Roles...");

    for (const role of ROLES) {
    await prisma.role.upsert({
    where: {
        slug: role.slug,
        },
    update: {
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        },
    create: role,
  });
}

console.log(`✅ ${ROLES.length} roles seeded.`);

console.log("🔐 Seeding Permissions...");

for (const permission of PERMISSIONS) {
  await prisma.permission.upsert({
    where: {
      slug: permission.slug,
    },
    update: {
      name: permission.name,
      description: permission.description,
      category: permission.category,
    },
    create: permission,
  });
}

console.log("🔗 Assigning Role Permissions...");

const roles = await prisma.role.findMany();

const permissions = await prisma.permission.findMany();

const permissionMap = new Map(
  permissions.map((permission) => [permission.slug, permission])
);

for (const role of roles) {
  const allowedPermissions = DEFAULT_ROLE_PERMISSIONS[role.slug] ?? [];

  const selectedPermissions =
    allowedPermissions.includes("*")
      ? permissions
      : allowedPermissions
          .map((slug) => permissionMap.get(slug))
          .filter((permission): permission is typeof permissions[number] => Boolean(permission));

  for (const permission of selectedPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  }
}

console.log("✅ Role permissions assigned.");

console.log("👤 Creating Super Administrator...");

const SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL ?? "admin@elitebattlegrounds.com";

const SUPER_ADMIN_PASSWORD =
  process.env.SUPER_ADMIN_PASSWORD ?? "ChangeMe123!";

const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

const superAdminRole = await prisma.role.findUnique({
  where: {
    slug: "super-admin",
  },
});

if (!superAdminRole) {
  throw new Error("Super Administrator role was not found.");
}

const superAdmin = await prisma.user.upsert({
  where: {
    email: SUPER_ADMIN_EMAIL,
  },
  update: {
    displayName: "Super Administrator",
    firstName: "Super",
    lastName: "Administrator",
    passwordHash,
    status: UserStatus.ACTIVE,
    isSystem: true,
  },
  create: {
    username: "superadmin",
    email: SUPER_ADMIN_EMAIL,
    displayName: "Super Administrator",
    firstName: "Super",
    lastName: "Administrator",
    passwordHash,
    status: UserStatus.ACTIVE,
    isSystem: true,
  },
});

await prisma.userRole.upsert({
  where: {
    userId_roleId: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  },
  update: {},
  create: {
    userId: superAdmin.id,
    roleId: superAdminRole.id,
  },
});

console.log("✅ Super Administrator created.");

console.log("⚙️ Seeding System Settings...");

for (const setting of DEFAULT_SETTINGS) {
  await prisma.setting.upsert({
    where: {
      key: setting.key,
    },
    update: {
      name: setting.name,
      value: setting.value,
      dataType: setting.dataType as any,
      category: setting.category,
      isEditable: setting.isEditable,
      isSystem: setting.isSystem,
    },
    create: setting as any,
  });
}

console.log(`✅ ${DEFAULT_SETTINGS.length} system settings seeded.`);

}

main()
  .then(async () => {
    console.log("✅ Seed completed successfully.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed.");
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });

