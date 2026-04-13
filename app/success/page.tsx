"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { handleGoogleLogin } from "../lib/appwrite";// adjust path

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

  return(
  <div
  className=" min-h-screen w-screen flex flex-col items-center gap-8 relative"
  style={{
    backgroundImage: "url('gymbackground2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
 
  <div className="absolute inset-0 bg-black/85"></div>

 
  <div className="relative z-10 text-white pt-8 flex flex-col items-center gap-6 pb-4">
 
 <div className="flex flex-col gap-6  items-center justify-center">
<div className="flex gap-4 items-center justify-center ">
<div
  className={`h-1.5 lg:w-50 w-20 rounded-3xl ${stage === 1 ? "bg-[#2ED843]" : "bg-[#D9D9D980]"}`}
></div>
<div
  className={`h-1.5 lg:w-50 w-20 rounded-3xl ${stage === 2 ? "bg-[#2ED843]" : "bg-[#D9D9D980]"}`}
></div>
<div
  className={`h-1.5 lg:w-50 w-20 rounded-3xl ${stage === 3 ? "bg-[#2ED843]" : "bg-[#D9D9D980]"}`}
></div>
</div>
{stage === 1 && (<div className="flex flex-col gap-0 items-center">
<h3 className="lg:text-[50px] text-[25px] font-semibold text-white">What's your primary goal?</h3>
<h4 className="lg:text-[30px] text-[18px] font-normal text-white">This helps us tailor your workout plan</h4>
  </div>
  )}
{stage === 2 && (<p>Stage 2 Content</p>)}
{stage === 3 && (<p>Stage 3 Content</p>)}
 </div>

{stage === 1 && (
<div
className="grid lg:grid-cols-3 grid-cols-1 lg:gap-12 gap-6"
> 
<div className={`w-60 h-60 rounded-2xl duration-200  flex items-end justify-center cursor-pointer ${plan === 'strength' ? 'border-4 border-[#2ED843]' : ''}`}
style={{
    backgroundImage: "url('strength1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
  onClick={() => {
    setPlan('strength');
  }}
>
<h3 className="font-bold lg:text-[25px] text-[18px] text-white pb-1">strength</h3>
</div>


<div className={`w-60  duration-200 h-60 rounded-2xl  flex items-end justify-center cursor-pointer ${plan === 'weight-loss' ? 'border-4 border-[#2ED843]' : ''}`}
style={{
    backgroundImage: "url('musclegain.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
   onClick={() => {
    setPlan('weight-loss');
  }}
>
<h3 className="font-bold lg:text-[25px] text-[18px] text-white pb-1">Weight loss</h3>
</div>



<div className={`w-60  duration-200 h-60 rounded-2xl  flex items-end justify-center cursor-pointer ${plan === 'endurance' ? 'border-4 border-[#2ED843]' : ''}`}
style={{
    backgroundImage: "url('endurance.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
   onClick={() => {
    setPlan('endurance');
  }}
>
<h3 className="font-bold lg:text-[25px] text-[18px] text-white pb-1">Endurance</h3>
</div>



<div className={`w-60 h-60  duration-200 rounded-2xl  flex items-end justify-center cursor-pointer ${plan === 'muscle-gain' ? 'border-4 border-[#2ED843]' : ''}`}
style={{
    backgroundImage: "url('musclegain2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
   onClick={() => {
    setPlan('muscle-gain');
  }}
>
<h3 className="font-bold lg:text-[25px] text-[18px] text-white pb-1">Muscle gain</h3>
</div>



<div className={`w-60 h-60  duration-200 rounded-2xl  flex items-end justify-center cursor-pointer ${plan === 'general-fitness' ? 'border-4 border-[#2ED843]' : ''}`}
style={{
    backgroundImage: "url('generalfitness.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
   onClick={() => {
    setPlan('general-fitness');
  }}
>
<h3 className="font-bold lg:text-[25px] text-[18px] text-white pb-1">General fitness</h3>
</div>


<div className={`w-60 h-60 rounded-2xl  duration-200  flex items-end justify-center cursor-pointer ${plan === 'flexibility' ? 'border-4 border-[#2ED843]' : ''}`}
style={{
    backgroundImage: "url('flexible4.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
   onClick={() => {
    setPlan('flexibility');
  }}
>
<h3 className="font-bold lg:text-[25px]  duration-200 text-[18px] text-white pb-1">Flexibility</h3>
</div>

</div>

)}
<div className="flex items-center justify-center">
    <button className="w-70 h-13 text-bold rounded-2xl bg-[#2ED843] cursor-pointer text-black font-bold lg:text-[18px] text-[16px]">
      Continue
    </button>
  </div>
  </div>
  
</div>
  )
}