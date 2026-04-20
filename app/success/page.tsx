"use client";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { handleGoogleLogin } from "../lib/appwrite";// adjust path
import { FaLongArrowAltLeft } from "react-icons/fa";
import { equipmentOptions, daysOptions, planOptions, experiencee} from "./data";// 
import { useGlobalContext } from "../context/globalprovider";
import { databases } from "../lib/appwrite";
import { ID } from "appwrite";
import { appwriteConfig } from "../lib/appwrite";
import { ClipLoader } from "react-spinners";
export default function SuccessPage() {


  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        await handleGoogleLogin();
        console.log("Google login successful");
      } catch (error) {
        console.error(error);
      }
    };

    run();
  }, []);

const [stage, setStage] = useState<number>(1);
const [plan, setPlan] = useState<string>('');
const [equipment, setEquipment] = useState<string>('');
const [day, setDay] = useState<string>('');
const [experience, setExperience] = useState<string>('');
const [loader, setLoader] = useState(false);
 const [value, setValue] = useState<number>(45);
 const min = 0;
  const max = 90;


  const percentage = ((value - min) / (max - min)) * 100;

function Next() {
  // Stage 1 validation
  if (stage === 1) {
    if (!plan) {
      alert("Please select a goal before continuing");
      return;
    }
  }

  // Stage 2 validation
  if (stage === 2) {
    if (!equipment || !day || !experience || value === 0) {
      alert("Please select all options (equipment, schedule, and experience)");
      return;
    }
  }

  // Stage 3 validation
  

  // If all validations pass → move forward
  if (stage === 3) {
    setStage(1);
  } else {
    setStage(stage + 1);
  }
}

function Back() {
  setStage(stage - 1);
}

type FormData = {
  age: number | "";
  injuries: string;
  weight: number | "";
  diet: string;
  height: number | "";
};

const [formData, setFormData] = useState<FormData>({
  age: "",
  injuries: "",
  weight: "",
  diet: "Vegetarian",
  height: "",
});

const backgroundMap: Record<number, string> = {
  1: "gymbackground2.jpg",
  2: "bg1.jpg",
  3: "bg2.jpg",
};


  const { user } = useGlobalContext()


 async function submitBio() {
  setLoader(true); // ✅ start loading

  try {
    // Validation
    if (stage === 3) {
      if (
        formData.age === "" ||
        formData.weight === "" ||
        formData.height === "" ||
        !formData.diet
      ) {
        alert("Please fill in all required fields before continuing");
        return; // ❗ still safe because of finally
      }
    }

    // Create document
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bioID,
        user.$id,
      {
        users: user?.$id,

        goal: plan,
        equipment: equipment,
        schedule: day,
        experience: experience,
        duration: value,

        age: formData.age,
        injuries: formData.injuries,
        diet: formData.diet,
        height: formData.height,
        weight: formData.weight,
      }
    );

    console.log("Bio saved successfully");
    alert("Bio saved successfully. Redirecting to dashboard...");

    router.push("/Dashboard");

  } catch (error) {
    console.error("Error saving bio:", error);
    alert("Something went wrong while saving your data");
  } finally {
    setLoader(false); // ✅ ALWAYS stops loader
  }
}

  return(
  <div
  className=" min-h-screen w-screen flex flex-col items-center gap-8 relative  "
  style={{
    backgroundImage:  `url('${backgroundMap[stage]}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
 
  <div className="absolute inset-0 bg-black/90"></div>

 
  <div className="relative z-10 text-white pt-8 flex flex-col items-center gap-6 pb-4">
 
 <div className="flex flex-col gap-6  items-center justify-center">
<div className="flex gap-4 items-center justify-center ">
<div
  className={`h-1.5 lg:w-50 w-20 rounded-3xl ${stage >= 1 ? "bg-[#2ED843]" : "bg-[#D9D9D980]"}`}
></div>
<div
  className={`h-1.5 lg:w-50 w-20 rounded-3xl ${stage >= 2 ? "bg-[#2ED843]" : "bg-[#D9D9D980]"}`}
></div>
<div
  className={`h-1.5 lg:w-50 w-20 rounded-3xl ${stage >= 3 ? "bg-[#2ED843]" : "bg-[#D9D9D980]"}`}
></div>
</div>
{stage === 1 && (<div className="flex flex-col gap-0 items-center">
<h3 className="lg:text-[50px] text-[25px] font-semibold text-white">What's your primary goal?</h3>
<h4 className="lg:text-[30px] text-[18px] font-normal text-white">This helps us tailor your workout plan</h4>
  </div>
  )}
{stage === 2 && (
  <div className="flex justify-center]">
    <FaLongArrowAltLeft color= "white"  className="relative cursor-pointer lg:right-[20%] right-[8%] text-[20px] lg:text-[25px]" onClick={Back}/>
  <div className="flex flex-col gap-0 items-center">
  
<h3 className="lg:text-[50px] text-[25px] font-semibold text-white">Let's plan your workouts</h3>

<h4 className="lg:text-[30px] text-[18px] font-normal text-white">Stay focused on your goals</h4>
</div>
  </div>)}
{stage === 3 && ( <div className="flex justify-center]">
    <FaLongArrowAltLeft color= "white"  className="relative cursor-pointer lg:right-[20%] right-[8%] text-[20px] lg:text-[25px]" onClick={Back}/>
  <div className="flex flex-col gap-0 items-center">
  
<h3 className="lg:text-[50px] text-[25px] font-semibold text-white">Let's plan your workouts</h3>

<h4 className="lg:text-[30px] text-[18px] font-normal text-white">Stay focused on your goals</h4>
</div>
  </div>)}
 </div>

{stage === 1 && (
<div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-12 gap-6">
  {planOptions.map((item) => (
    <div
      key={item.value}
      className={`w-60 h-60 rounded-2xl duration-200 flex items-end justify-center border-4 cursor-pointer ${
        plan === item.value ? " border-[#2ED843]" : ""
      }`}
      style={{
        backgroundImage: `url('${item.image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onClick={() => {
        setPlan(item.value);
      }}
    >
      <h3 className="font-bold lg:text-[25px] text-[18px] text-white pb-1">
        {item.label}
      </h3>
    </div>
  ))}
</div>
)}

{stage === 2 && ( 

  <div className="flex flex-col   gap-6 ">
    <div className="grid gap-3">
      <h3 className="font-bold lg:text-[30px] ">Equipment </h3>

<div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
  {equipmentOptions.map((item) => (
    <div
      key={item}
      className={`lg:w-65   lg:text-[24px] h-13 rounded-xl border-2 flex items-center justify-center cursor-pointer ${
        equipment === item ? " border-4 border-[#2ED843]" : "border-white"
      }`}
      onClick={() => {
        setEquipment(item);
      }}
    >
      {item}
    </div>
  ))}
</div>
    </div>


    <div className="grid gap-3">

         <h3 className="font-bold lg:text-[30px] ">Weekly Schedule</h3>

        <div className="grid lg:grid-cols-7  grid-cols-5 gap-5">
  {daysOptions.map((item, index) => (
    <div
      key={index}
      className={`font-normal lg:text-[24] rounded-xl cursor-pointer text-white flex items-center justify-center w-14 h-14 border-2 ${
        day === item.value ? " border-4 border-[#2ED843]" : "border-white"
      }`}
      onClick={() => {
        setDay(item.value);
      }}
    >
      {item.label}
    </div>
  ))}
</div>
       </div>

        <div className="grid gap-3">
      <h3 className="font-bold lg:text-[30px] ">Experience Level </h3>

<div className="grid grid-cols-3 gap-5">
  {experiencee.map((item) => (
    <div
      key={item}
      className={`lg:w-65 lg:text-[24px] h-13 rounded-xl border-2 flex items-center justify-center cursor-pointer ${
        experience === item ? " border-4 border-[#2ED843]" : "border-white"
      }`}
      onClick={() => {
        setExperience(item);
      }}
    >
      {item}
    </div>
  ))}
</div>
    </div>
    

      
      {/* Slider Wrapper */}
<div className="flex flex-col  mt-10 ">
    <h3 className="font-bold lg:text-[30px] ">Workout Duration </h3>
      <div className="flex flex-col items-center justify-center mt-8">
      
      {/* Slider Wrapper */}
      <div className="relative w-77.5 lg:w-125">

        {/* Track */}
        <div className="relative h-6 flex items-center">
          
          {/* White line */}
          <div className="absolute w-full h-1 bg-white rounded-full" />

          {/* Green progress */}
          <div
            className="absolute h-1 bg-green-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />

          {/* Min label (left, inline) */}
          <span className="absolute -left-6 text-white font-bold lg:text-[30px] text-[18px]">
            {min}
          </span>

          {/* Max label (right, inline) */}
          <span className="absolute -right-10 font-bold text-white lg:text-[30px] text-[18px]">
            {max}
          </span>

          {/* Floating value above thumb */}
          <div
            className="absolute -top-6 text-green-500 text-sm font-semibold"
            style={{
              left: `calc(${percentage}% - 12px)`,
            }}
          >
            {value}
          </div>

          {/* Invisible input */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="absolute w-full appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-green-500

              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-green-500"
          />
        </div>
      </div>
    </div>
 </div>

    
  </div>
)}
{stage === 3 && (<div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-12 gap-9">
  
 <div className="flex flex-col gap-2">
  <h4>Age</h4>
  <input
    type="number"
    value={formData.age}
    onChange={(e) =>
      setFormData({ ...formData, age: e.target.value === "" ? "" : Number(e.target.value) })
    }
    className="outline-none bg-transparent text-white placeholder:text-white lg:w-60 h-8 border-2 rounded-md pl-3"
  />
</div>

<div className="flex flex-col gap-2">
  <h4>Injuries</h4>
  <input
    type="text"
    value={formData.injuries}
    onChange={(e) =>
      setFormData({ ...formData, injuries: e.target.value })
    }
    className="outline-none bg-transparent text-white placeholder:text-white lg:w-60 h-8 border-2 rounded-md pl-3"
  />
</div>

<div className="flex flex-col gap-2">
  <h4>Weight</h4>
  <div className="lg:w-60 h-8 border-2 rounded-md pl-3 flex justify-between items-center">
    <input
      type="number"
      value={formData.weight}
      onChange={(e) =>
        setFormData({ ...formData, weight: e.target.value === "" ? "" : Number(e.target.value) })
      }
      className="outline-none bg-transparent text-white placeholder:text-white w-full"
    />
    <h5 className="text-sm pr-2">Kg</h5>
  </div>
</div>

<div className="w-64 relative flex flex-col gap-2">
   <h4>Diet</h4>
  <select
    value={formData.diet}
    onChange={(e) =>
      setFormData({ ...formData, diet: e.target.value })
    }
    className="w-full h-10 pl-4 pr-12 rounded-md border-2 bg-transparent text-white cursor-pointer"
  >
  
  
    <option value="Vegetarian" className="text-black">Vegetarian</option>
    <option value="Pescatarian" className="text-black">Pescatarian</option>
    <option value="Balanced" className="text-black">Balanced</option>
    <option value="High-Protein" className="text-black">High-Protein</option>
    <option value="Keto" className="text-black">Keto</option>
  </select>
</div>

<div className="flex flex-col gap-2">
  <h4>Height</h4>
  <div className="lg:w-60 h-8 border-2 rounded-md pl-3 flex justify-between items-center">
    <input
      type="number"
      value={formData.height}
      onChange={(e) =>
        setFormData({ ...formData, height: e.target.value === "" ? "" : Number(e.target.value) })
      }
      className="outline-none bg-transparent text-white placeholder:text-white w-full"
    />
    <h5 className="text-sm pr-2">Cm</h5>
  </div>
</div>

   </div>)}
{stage === 3 ? <div className="flex items-center justify-center mt-3">
  <button
    onClick={submitBio}
    disabled={loader}
    className="w-70 h-13 flex items-center justify-center rounded-2xl bg-[#2ED843] cursor-pointer text-black font-bold lg:text-[18px] text-[16px] border-2 border-[#2ED843] hover:bg-white duration-200 disabled:opacity-70"
  >
    {loader ? (
      <ClipLoader size={20} color="black" />
    ) : (
      "Continue"
    )}
  </button>
</div> : 
   <div className="flex items-center justify-center mt-3">
    <button className="w-70 h-13 text-bold rounded-2xl bg-[#2ED843] cursor-pointer text-black font-bold lg:text-[18px] text-[16px] border-2 border-[#2ED843] hover:bg-white duration-200 "
    onClick={Next}
    >
      Continue
    </button>
  </div>
}

  </div>
</div>
  )
}