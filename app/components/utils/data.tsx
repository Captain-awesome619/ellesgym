export const EXERCISES: Record<
  string,
  {
    routine: string;
    level: "Beginner" | "Intermediate" | "Expert";
    muscleGroup: string;
    exercises: string[];
    description: string;
    equipment: string;
    overview: string;
    tips: string[];
    commonMistakes: string[];
  }[]
> = {
  strength: [
    {
      routine: "Upper Body Strength",
      level: "Beginner",
      muscleGroup: "Chest, Shoulders, Arms",
      exercises: [
        "Wall Push-ups",
        "Dumbbell Shoulder Press",
        "Resistance Band Rows",
        "Knee Push-ups",
      ],
      description:
        "Foundational upper-body strength training targeting push and pull patterns.",
      equipment: "Bodyweight, Dumbbells, Resistance Bands",
      overview: "Builds basic upper-body strength and stability.",
      tips: ["Keep core tight", "Move slowly", "Maintain alignment"],
      commonMistakes: ["Sagging hips", "Using momentum", "Poor posture"],
    },

    {
      routine: "Upper Body Strength",
      level: "Intermediate",
      muscleGroup: "Chest, Shoulders, Arms",
      exercises: [
        "Bench Press",
        "Pull-ups",
        "Shoulder Press",
        "Barbell Rows",
      ],
      description:
        "Intermediate compound lifting focused on strength and muscle development.",
      equipment: "Barbell, Dumbbells, Bodyweight",
      overview: "Develops upper-body power and hypertrophy.",
      tips: ["Full range of motion", "Engage core", "Controlled reps"],
      commonMistakes: ["Half reps", "Arching back", "Overloading weight"],
    },

    {
      routine: "Upper Body Strength",
      level: "Expert",
      muscleGroup: "Chest, Shoulders, Arms",
      exercises: [
        "Weighted Pull-ups",
        "Incline Bench Press",
        "Arnold Press",
        "Ring Dips",
      ],
      description:
        "Advanced upper-body strength focusing on power and control.",
      equipment: "Weighted Belt, Barbell, Rings",
      overview: "Maximizes strength and muscular endurance.",
      tips: ["Explosive control", "Perfect form", "Slow eccentric"],
      commonMistakes: ["Swinging", "Poor stabilization", "Incomplete reps"],
    },
  ],

  endurance: [
    {
      routine: "Cardio Endurance",
      level: "Beginner",
      muscleGroup: "Full Body Cardio",
      exercises: [
        "Brisk Walking",
        "Light Cycling",
        "Jump Rope",
        "Jogging",
      ],
      description: "Low-intensity cardio for endurance foundation.",
      equipment: "Bodyweight, Bike, Rope",
      overview: "Improves heart health and stamina.",
      tips: ["Steady pace", "Controlled breathing", "Stay consistent"],
      commonMistakes: ["Overexertion", "Irregular pacing"],
    },

    {
      routine: "Cardio Endurance",
      level: "Intermediate",
      muscleGroup: "Full Body Cardio",
      exercises: ["Running", "Cycling", "Rowing", "Swimming"],
      description: "Moderate-intensity endurance conditioning.",
      equipment: "Bike, Row Machine, Pool",
      overview: "Builds cardiovascular capacity.",
      tips: ["Maintain rhythm", "Hydrate", "Warm up properly"],
      commonMistakes: ["Poor pacing", "Skipping warm-up"],
    },

    {
      routine: "Stamina Training",
      level: "Expert",
      muscleGroup: "Legs & Conditioning",
      exercises: [
        "Sprint Intervals",
        "Battle Ropes",
        "Tire Flips",
        "Burpees",
      ],
      description: "High-intensity conditioning for peak performance.",
      equipment: "Ropes, Tires, Bodyweight",
      overview: "Maximizes explosive endurance.",
      tips: ["Explosive effort", "Short rest", "Maintain form"],
      commonMistakes: ["Burnout early", "Poor technique"],
    },
  ],

  "muscle-gain": [
    {
      routine: "Upper Body Hypertrophy",
      level: "Beginner",
      muscleGroup: "Chest, Back & Arms",
      exercises: [
        "Machine Chest Press",
        "Seated Rows",
        "Dumbbell Fly",
        "Bicep Curls",
      ],
      description: "Beginner muscle-building upper-body routine.",
      equipment: "Machines, Dumbbells",
      overview: "Focuses on controlled hypertrophy.",
      tips: ["Slow reps", "Mind-muscle connection", "Consistency"],
      commonMistakes: ["Rushing sets", "Poor form"],
    },

    {
      routine: "Lower Body Hypertrophy",
      level: "Intermediate",
      muscleGroup: "Legs & Glutes",
      exercises: [
        "Leg Press",
        "Romanian Deadlift",
        "Bulgarian Split Squats",
        "Hip Thrusts",
      ],
      description: "Intermediate hypertrophy leg training.",
      equipment: "Barbell, Machines",
      overview: "Builds muscle size and strength.",
      tips: ["Deep range", "Controlled tempo"],
      commonMistakes: ["Locking joints", "Momentum lifting"],
    },

    {
      routine: "Advanced Mass Builder",
      level: "Expert",
      muscleGroup: "Full Body Hypertrophy",
      exercises: [
        "Deadlifts",
        "Weighted Dips",
        "Heavy Squats",
        "Incline Dumbbell Press",
      ],
      description:
        "Advanced hypertrophy training focused on maximum muscle growth.",
      equipment: "Barbell, Dumbbells",
      overview: "Maximizes muscular size and strength.",
      tips: ["Progressive overload", "Control eccentric movement"],
      commonMistakes: ["Overtraining", "Poor recovery"],
    },
  ],

  "weight-loss": [
    {
      routine: "Fat Burning Cardio",
      level: "Beginner",
      muscleGroup: "Full Body Fat Burn",
      exercises: [
        "Fast Walking",
        "Jumping Jacks",
        "Bodyweight Squats",
        "Light Jogging",
      ],
      description: "Low-intensity fat burning cardio routine.",
      equipment: "Bodyweight",
      overview: "Burns calories safely and steadily.",
      tips: ["Stay consistent", "Keep moving"],
      commonMistakes: ["Stopping frequently", "Overeating after workout"],
    },

    {
      routine: "Full Body Burn",
      level: "Intermediate",
      muscleGroup: "Full Body",
      exercises: [
        "Burpees",
        "Kettlebell Swings",
        "Jump Squats",
        "Plank",
      ],
      description: "Full-body fat-burning circuit training.",
      equipment: "Kettlebell, Bodyweight",
      overview: "High calorie burn conditioning.",
      tips: ["Fast transitions", "Controlled form"],
      commonMistakes: ["Poor form under fatigue"],
    },

    {
      routine: "HIIT Shred",
      level: "Expert",
      muscleGroup: "Full Body Conditioning",
      exercises: [
        "Sprint Circuits",
        "Box Jumps",
        "Battle Ropes",
        "Burpee Pull-ups",
      ],
      description:
        "Advanced fat-loss conditioning with high-intensity intervals.",
      equipment: "Box, Pull-up Bar, Ropes",
      overview: "Accelerates calorie burn and conditioning.",
      tips: ["Push intensity", "Short recovery periods"],
      commonMistakes: ["Poor pacing", "Ignoring recovery"],
    },
  ],

  flexibility: [
    {
      routine: "Mobility Training",
      level: "Beginner",
      muscleGroup: "Joints & Mobility",
      exercises: [
        "Arm Circles",
        "Neck Rolls",
        "Hip Rotations",
        "Cat Cow Stretch",
      ],
      description: "Basic joint mobility and flexibility work.",
      equipment: "Bodyweight",
      overview: "Improves movement quality.",
      tips: ["Move slowly", "Breathe deeply"],
      commonMistakes: ["Forcing stretches"],
    },

    {
      routine: "Dynamic Flexibility",
      level: "Intermediate",
      muscleGroup: "Full Body Mobility",
      exercises: [
        "World’s Greatest Stretch",
        "Dynamic Hamstring Stretch",
        "Shoulder Mobility Flow",
        "Lunge Twists",
      ],
      description:
        "Intermediate flexibility work improving athletic movement.",
      equipment: "Bodyweight",
      overview: "Enhances range of motion and recovery.",
      tips: ["Control movement", "Stay consistent"],
      commonMistakes: ["Bouncing stretches"],
    },

    {
      routine: "Advanced Mobility Flow",
      level: "Expert",
      muscleGroup: "Full Body Flexibility",
      exercises: [
        "Deep Squat Holds",
        "Pigeon Stretch",
        "Jefferson Curl",
        "Bridge Holds",
      ],
      description:
        "Advanced mobility and flexibility progression routine.",
      equipment: "Yoga Mat, Light Weights",
      overview: "Improves advanced flexibility and joint control.",
      tips: ["Focus on breathing", "Increase range gradually"],
      commonMistakes: ["Overstretching", "Holding breath"],
    },
  ],

  "general-fitness": [
    {
      routine: "Bodyweight Basics",
      level: "Beginner",
      muscleGroup: "Full Body",
      exercises: ["Wall Push-ups", "Air Squats", "Plank", "Sit-ups"],
      description: "Foundational fitness routine.",
      equipment: "Bodyweight",
      overview: "Builds overall fitness base.",
      tips: ["Consistency matters", "Focus on form"],
      commonMistakes: ["Rushing reps"],
    },

    {
      routine: "Functional Conditioning",
      level: "Intermediate",
      muscleGroup: "Full Body",
      exercises: [
        "Push-ups",
        "Walking Lunges",
        "Mountain Climbers",
        "Russian Twists",
      ],
      description: "Intermediate full-body functional training.",
      equipment: "Bodyweight, Dumbbells",
      overview: "Improves strength, mobility, and endurance.",
      tips: ["Maintain rhythm", "Engage core"],
      commonMistakes: ["Poor breathing", "Bad posture"],
    },

    {
      routine: "Elite Functional Fitness",
      level: "Expert",
      muscleGroup: "Athletic Full Body",
      exercises: [
        "Thrusters",
        "Pull-ups",
        "Box Jumps",
        "Farmer Carries",
      ],
      description:
        "Advanced functional training for peak overall fitness.",
      equipment: "Barbell, Dumbbells, Plyo Box",
      overview: "Combines strength, endurance, and athleticism.",
      tips: ["Explosive movement", "Recover properly"],
      commonMistakes: ["Using momentum", "Poor recovery"],
    },
  ],
};