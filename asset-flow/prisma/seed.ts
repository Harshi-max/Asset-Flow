import bcrypt from "bcryptjs";
import { getPrismaClient } from "../src/lib/prisma-safe";

const prisma = getPrismaClient();

async function main() {
  console.log("Starting seed script...");

  // Check for idempotency
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@assetflow.com" },
  });

  if (adminExists) {
    console.log("Demo data already exists. Skipping seed to prevent duplicates.");
    return;
  }

  // Generate Categories
  const categoryNames = [
    "Laptops", "Desktops", "Monitors", "Printers", "Projectors",
    "Servers", "Mobile Phones", "Tablets", "Routers", "Networking Equipment",
    "Office Furniture", "Cameras", "Scanners", "Switches", "Storage Devices",
    "Keyboards & Mice", "Audio Equipment", "Whiteboards", "Video Conferencing", "Cabling"
  ];

  const categories: { id: string; name: string }[] = await Promise.all(
    categoryNames.map(name => prisma.assetCategory.create({ data: { name } }))
  );
  console.log(`Created ${categories.length} categories.`);

  // Generate Departments
  const deptNames = [
    "Engineering", "Human Resources", "Finance", "Marketing",
    "IT Support", "Operations", "Sales", "Administration"
  ];

  const departments: { id: string; name: string }[] = await Promise.all(
    deptNames.map(name => prisma.department.create({ data: { name } }))
  );
  console.log(`Created ${departments.length} departments.`);

  // Create Users
  const roles = ["EMPLOYEE", "ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD"];
  
  // Specific Demo Users
  const adminHash = await bcrypt.hash("Admin@123", 10);
  const managerHash = await bcrypt.hash("Manager@123", 10);
  const deptHeadHash = await bcrypt.hash("Dept@123", 10);
  const employeeHash = await bcrypt.hash("Employee@123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@assetflow.com",
      name: "System Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      departmentId: departments.find((d: { id: string; name: string }) => d.name === "Administration")?.id,
    }
  });

  // Create alternate admin user requested by the user (admin123 / 123)
  const admin123Exists = await prisma.user.findUnique({ where: { email: "admin123@assetflow.com" } });
  if (!admin123Exists) {
    const admin123Hash = await bcrypt.hash("123", 10);
    await prisma.user.create({
      data: {
        email: "admin123@assetflow.com",
        name: "admin123",
        passwordHash: admin123Hash,
        role: "ADMIN",
        departmentId: departments.find((d: { id: string; name: string }) => d.name === "Administration")?.id,
      }
    });
    console.log("Created admin user admin123@assetflow.com (password: 123)");
  } else {
    console.log("Admin user admin123 already exists. Skipping creation.");
  }

  const manager = await prisma.user.create({
    data: {
      email: "manager@assetflow.com",
      name: "Asset Manager",
      passwordHash: managerHash,
      role: "ASSET_MANAGER",
      departmentId: departments.find((d: { id: string; name: string }) => d.name === "IT Support")?.id,
    }
  });

  const deptHead = await prisma.user.create({
    data: {
      email: "depthead@assetflow.com",
      name: "Department Head",
      passwordHash: deptHeadHash,
      role: "DEPARTMENT_HEAD",
      departmentId: departments.find((d: { id: string; name: string }) => d.name === "Engineering")?.id,
    }
  });
  
  // Set the head of the Engineering department
  await prisma.department.update({
    where: { id: departments.find(d => d.name === "Engineering")!.id },
    data: { headId: deptHead.id }
  });

  const employee = await prisma.user.create({
    data: {
      email: "employee@assetflow.com",
      name: "Standard Employee",
      passwordHash: employeeHash,
      role: "EMPLOYEE",
      departmentId: departments.find(d => d.name === "Engineering")?.id,
    }
  });

  // Create remaining 46 employees randomly
  const allUsers = [admin, manager, deptHead, employee];
  for (let i = 0; i < 46; i++) {
    const randomDept = departments[Math.floor(Math.random() * departments.length)];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const user = await prisma.user.create({
      data: {
        email: `emp${i+1}@example.com`,
        name: `Employee ${i+1}`,
        passwordHash: employeeHash, // Just re-use hash for speed
        role: randomRole,
        departmentId: randomDept.id,
      }
    });
    allUsers.push(user);
  }
  console.log(`Created 50 users.`);

  // Create Assets
  const assetStatuses = ["ACTIVE", "ALLOCATED", "RESERVED", "MAINTENANCE", "LOST", "RETIRED"];
  const assets = [];
  
  for (let i = 0; i < 200; i++) {
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const randomDept = departments[Math.floor(Math.random() * departments.length)];
    const randomStatus = assetStatuses[Math.floor(Math.random() * assetStatuses.length)];
    const purchaseCost = Math.floor(Math.random() * 2000) + 100;
    
    // Some dates
    const purchaseDate = new Date();
    purchaseDate.setDate(purchaseDate.getDate() - Math.floor(Math.random() * 1000));
    
    const asset = await prisma.asset.create({
      data: {
        tag: `AST-${(i+1).toString().padStart(4, '0')}`,
        name: `${randomCat.name} Model ${Math.floor(Math.random() * 100)}`,
        categoryId: randomCat.id,
        serialNumber: `SN${Math.floor(Math.random() * 9999999)}`,
        purchaseDate,
        purchaseCost,
        departmentId: randomDept.id,
        status: randomStatus,
        location: `Office ${Math.floor(Math.random() * 5) + 1}`,
      }
    });
    assets.push(asset);
  }
  console.log(`Created 200 assets.`);

  // Create Allocations (150)
  // Ensure we don't pick assets that are already retired or lost for new allocations
  const allocatableAssets = assets.filter(a => a.status === "ACTIVE" || a.status === "ALLOCATED");
  for (let i = 0; i < 150; i++) {
    if (i >= allocatableAssets.length) break;
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const asset = allocatableAssets[i];
    
    // Update asset to allocated
    await prisma.asset.update({ where: { id: asset.id }, data: { status: "ALLOCATED" } });
    
    await prisma.allocation.create({
      data: {
        assetId: asset.id,
        holderId: randomUser.id,
        departmentId: randomUser.departmentId,
        status: "ALLOCATED",
      }
    });
  }
  console.log(`Created 150 allocations.`);

  // Create Bookings (45)
  for(let i = 0; i < 45; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const startAt = new Date();
    startAt.setDate(startAt.getDate() + Math.floor(Math.random() * 10) - 2); // Past and future
    const endAt = new Date(startAt);
    endAt.setHours(startAt.getHours() + 2);
    
    await prisma.booking.create({
      data: {
        title: `Booking ${i+1}`,
        resourceType: "Meeting Room",
        organizerId: randomUser.id,
        startAt,
        endAt,
        status: i % 3 === 0 ? "APPROVED" : "PENDING",
      }
    });
  }
  console.log(`Created 45 bookings.`);

  // Create Maintenance Requests (30)
  for(let i = 0; i < 30; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    const statuses = ["REQUESTED", "IN_PROGRESS", "COMPLETED"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    await prisma.maintenanceRequest.create({
      data: {
        assetId: randomAsset.id,
        requestedById: randomUser.id,
        priority: "HIGH",
        status: status,
        issue: `Issue with ${randomAsset.name}`,
      }
    });
  }
  console.log(`Created 30 maintenance requests.`);

  // Notifications (20)
  const notifMsgs = [
    "Asset assigned", "Booking approved", "Maintenance completed", 
    "Warranty expiring", "Audit scheduled", "Asset overdue"
  ];
  for(let i = 0; i < 20; i++) {
    await prisma.notification.create({
      data: {
        message: notifMsgs[Math.floor(Math.random() * notifMsgs.length)],
        read: i % 2 === 0,
      }
    });
  }
  console.log(`Created 20 notifications.`);

  // Activity Logs (300)
  const logActions = [
    "User Login", "Asset Created", "Asset Updated", "Booking Created",
    "Booking Approved", "Maintenance Requested", "Asset Returned", "Audit Completed"
  ];
  const logsToInsert = Array.from({ length: 300 }).map(() => ({
    action: logActions[Math.floor(Math.random() * logActions.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
  }));
  await prisma.activityLog.createMany({ data: logsToInsert });
  console.log(`Created 300 activity logs.`);

  // Audit Records (5)
  for(let i = 0; i < 5; i++) {
    await prisma.audit.create({
      data: { action: `Audit Cycle ${2020 + i} Completed` }
    });
  }
  console.log(`Created 5 audit records.`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
