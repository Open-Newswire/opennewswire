"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const fetchLicenses = async () => {
  return prisma.license.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const saveLicense = async (data: Prisma.LicenseCreateInput) => {
  return prisma.license.create({
    data,
  });
};

export const updateLicense = async (
  id: string,
  data: Prisma.LicenseUpdateInput,
) => {
  return prisma.license.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteLicense = async (id: string) => {
  return prisma.license.delete({ where: { id } });
};
