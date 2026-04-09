import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = new PrismaClient();

async function main() {
  await prisma.dayHabit.deleteMany();
  await prisma.day.deleteMany();
  await prisma.habitWeekDays.deleteMany();
  await prisma.habit.deleteMany();

  const today = dayjs().startOf("day");

  const drinkWater = await prisma.habit.create({
    data: {
      title: "Beber 2L de agua",
      created_at: today.subtract(10, "day").toDate(),
      weekDays: {
        create: [{ week_day: 1 }, { week_day: 2 }, { week_day: 3 }, { week_day: 4 }, { week_day: 5 }],
      },
    },
  });

  const exercise = await prisma.habit.create({
    data: {
      title: "Treinar 30 minutos",
      created_at: today.subtract(7, "day").toDate(),
      weekDays: {
        create: [{ week_day: 1 }, { week_day: 3 }, { week_day: 5 }],
      },
    },
  });

  const read = await prisma.habit.create({
    data: {
      title: "Ler 20 paginas",
      created_at: today.subtract(5, "day").toDate(),
      weekDays: {
        create: [{ week_day: 0 }, { week_day: 2 }, { week_day: 4 }, { week_day: 6 }],
      },
    },
  });

  const sleep = await prisma.habit.create({
    data: {
      title: "Dormir antes das 23h",
      created_at: today.subtract(3, "day").toDate(),
      weekDays: {
        create: [
          { week_day: 0 },
          { week_day: 1 },
          { week_day: 2 },
          { week_day: 3 },
          { week_day: 4 },
          { week_day: 5 },
          { week_day: 6 },
        ],
      },
    },
  });

  const yesterday = await prisma.day.create({
    data: {
      date: today.subtract(1, "day").toDate(),
    },
  });

  const twoDaysAgo = await prisma.day.create({
    data: {
      date: today.subtract(2, "day").toDate(),
    },
  });

  const dayHabits = [
    { day_id: yesterday.id, habit_id: drinkWater.id },
    { day_id: yesterday.id, habit_id: exercise.id },
    { day_id: yesterday.id, habit_id: sleep.id },
    { day_id: twoDaysAgo.id, habit_id: drinkWater.id },
    { day_id: twoDaysAgo.id, habit_id: read.id },
  ];

  for (const dayHabit of dayHabits) {
    await prisma.dayHabit.create({
      data: dayHabit,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
