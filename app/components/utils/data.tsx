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

    {
      routine: "Lower Body Strength",
      level: "Beginner",
      muscleGroup: "Legs & Glutes",
      exercises: [
        "Bodyweight Squats",
        "Glute Bridges",
        "Step-ups",
        "Walking Lunges",
      ],
      description: "Foundational lower-body strength development.",
      equipment: "Bodyweight",
      overview: "Builds leg strength and mobility.",
      tips: ["Drive through heels", "Keep chest up", "Control depth"],
      commonMistakes: ["Knee collapse", "Rounded back", "Shallow squats"],
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
      exercises: ["Burpees", "Kettlebell Swings", "Jump Squats", "Plank"],
      description: "Full-body fat-burning circuit training.",
      equipment: "Kettlebell, Bodyweight",
      overview: "High calorie burn conditioning.",
      tips: ["Fast transitions", "Controlled form"],
      commonMistakes: ["Poor form under fatigue"],
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
  ],
};