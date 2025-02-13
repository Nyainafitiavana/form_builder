"use server";

import {currentUser} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {formSchema, formSchemaType} from "@/schemas/form";
import {Form} from "@prisma/client";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new UserNotFoundErr();
        }

        const stats = await prisma.form.aggregate({
            where : {
                userId : user.id,
            },
            _sum : {
                visits: true,
                submissions: true
            }
        });

        const visits: number = stats._sum.visits || 0;
        const submissions: number = stats._sum.submissions || 0;

        let submissionRate = 0;

        if (visits > 0) {
            submissionRate = (submissions / visits) * 100;
        }

        const bounceRate = 100 - submissionRate;

        return {
            visits,
            submissions,
            submissionRate,
            bounceRate,
        }

    } catch (error) {
        console.error("Error in GetFormStats:", error);
        throw new Error("Failed to fetch form stats");
    }
}

export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("form not valid")
    }

    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundErr();
    }

    const {name, description} = data;

    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name: name,
            description: description
        }
    });

    if (!form) {
        throw new Error("Something went wrong");
    }

    return form.id;
}

export async function GetForms(): Promise<Form[]> {
    const user = await currentUser();
    if (!user) {
        throw new UserNotFoundErr();
    }

    return prisma.form.findMany({
       where: {
           userId: user.id,
       },
        orderBy: {
           createdAt: "desc"
        }
    });
}