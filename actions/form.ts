"use server";

import {currentUser} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
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
}