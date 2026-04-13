'use client';
import Image from "next/image";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useState,useEffect } from "react";
import google from '../public/google.svg'
import facebook from '../public/facebook.svg'
import { getCurrentUser, signInWithGoogle } from "./lib/appwrite";
import { createUser, signIn } from "./lib/appwrite";
import { useGlobalContext } from "./context/globalprovider";
import { useRouter } from 'next/navigation'
import { ClipLoader } from 'react-spinners';
import { useSearchParams } from "next/navigation";
import { accountt } from "./lib/appwrite";
import Modal from 'react-modal';
import VerifyEmailHandler from "./context/Verifyemailhandler";
import { Suspense } from "react";


type ErrorsType = {
  fullName?: string;
  email?: string;
  password?: string;
};

type LoginErrorsType = {
  email?: string;
  password?: string;
};




export default function Home() {


Modal.setAppElement("body");



 


  const { loading, isLogged,setUser,setIsLogged,user } = useGlobalContext()




  const navigate = useRouter();
 const [isSubmitting, setSubmitting] = useState(false);;

const [showPassword, setShowPassword] = useState(false);
 const [account, setAccount] = useState('login');


const [loginEmail, setLoginEmail] = useState<string>("");
const [loginPassword, setLoginPassword] = useState<string>("");
 
// form states
const [fullName, setFullName] = useState<string>("");
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");

// error states
const [errors, setErrors] = useState<ErrorsType>({});

const [loginErrors, setLoginErrors] = useState<LoginErrorsType>({});

const [showForgotModal, setShowForgotModal] = useState(false);
const [recoveryEmail, setRecoveryEmail] = useState("");
const [recoveryLoading, setRecoveryLoading] = useState(false);
const [recoveryError, setRecoveryError] = useState<string | null>(null);



const validateRecoveryEmail = (email: string) => {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex = /\S+@\S+\.\S+/;

  if (!emailRegex.test(email)) {
    return "Enter a valid email address";
  }

  return null;
};

const validateLogin = (): boolean => {
  let newErrors: LoginErrorsType = {};

  if (!loginEmail.trim()) {
    newErrors.email = "Field cannot be empty";
  }

  if (!loginPassword.trim()) {
    newErrors.password = "Field cannot be empty";
  }

  setLoginErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    alert("Login fields should be properly filled");
    return false;
  }

  return true;
};


const validateSignup = (): boolean => {
  let newErrors: ErrorsType = {};

  if (!fullName.trim()) {
    newErrors.fullName = "Full name is required";
  } else if (fullName.length < 3) {
    newErrors.fullName = "Full name must be at least 3 characters";
  }

  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "Enter a valid email";
  }

  if (!password) {
    newErrors.password = "Password is required";
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    newErrors.password =
      "Must include uppercase, lowercase, and a number";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    alert("Please fill all fields correctly");
    return false;
  }

  return true;
};


 const Handlesignup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!validateSignup()) {
    alert("Error: Please fill in all fields correctly");
    return;
  }

  setSubmitting(true);

  try {
    console.log("started");

 const result = await createUser(email, password, fullName);
console.log(fullName, email, password)
    console.log("user created:", result);

    setUser(result);
    setIsLogged(true);

    alert('please check mail for verification link')

   
  } catch (error) {
    console.log(error);
    alert("There was an error signing up");
  } finally {
    setSubmitting(false);
  }
}



const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!validateLogin()) {
  alert("Error: Please fill in all fields correctly");
  }
    
    setSubmitting(true);
    try {
      await signIn(loginEmail, loginPassword);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      alert("Success User signed in successfully");
      navigate.push("success");
    } catch (error) {
      alert("Error signing in");
    } finally {
      setSubmitting(false);
    }
};


const handleForgotPassword = async () => {
  const error = validateRecoveryEmail(recoveryEmail);

  if (error) {
    setRecoveryError(error);
    return;
  }

  // clear error if valid
  setRecoveryError(null);

  try {
    setRecoveryLoading(true);

    await accountt.createRecovery({
      email: recoveryEmail,
      url: "http://localhost:3000/forgotpassword",
    });

    alert("Reset link sent to your email");
    setShowForgotModal(false);
    setRecoveryEmail("");
      await accountt.deleteSession({
  sessionId: "current",
});
  } catch (error) {
    console.log(error);
    alert("Failed to send reset email");
  } finally {
    setRecoveryLoading(false);
  }
};
const handleFacebookLogin = () => {
  alert("Facebook login is not supported yet 😢. Please try Google.");
};

  return (
    <div className="  font-inter ">
       <Suspense fallback={<p>Verifying email...</p>}>
      <VerifyEmailHandler />
    </Suspense>
{ account=== 'login' ? (
      <div className="h-screen w-screen flex flex-col justify-center items-center  gap-12 "
       style={{
    backgroundImage: "url('login.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
      >
        <div className=" bg-[#121417F2] backdrop-blur-sm px-6 py-6 justify-center items-center flex flex-col rounded-xl  lg:w-125 w-[98%] h-140 gap-12">
<div className="flex flex-col items-center gap-1 justify-center">
<h3 className="font-bold text-[40px] text-[#FFFFFF] font-inter">Welcome Back</h3>
<h3 className="font-inter text-[16px] font-semibold text-[#FFFFFF]">Login to continue your training.</h3>
</div>


<form className="flex flex-col gap-4  items-center justify-center w-[90%]"
  onSubmit={handleLogin}
>
  
<div className=" gap-4  flex flex-col w-full">

 <div className="">
                  <div className="flex items-center pl-2 bg-[#121417F2] rounded-md border-[#ffffff] border h-11">
                 
                  <input
  value={loginEmail}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginEmail(e.target.value)
  }
  className="outline-none bg-transparent px-2 text-[#ffffff] placeholder:text-[#ffffff] w-full"
  placeholder="Email"
/>
                    <div className="ml-auto mr-2 cursor-pointer">
                      <MdOutlineMail size={20} color="white" />
                    </div>
                  </div>   
                  {loginErrors.email && (
  <p className="text-red-500 text-xs mt-1">{loginErrors.email}</p>
)}        
                </div>



                <div className="">
                  <div className="flex items-center pl-2 bg-[#121417F2] rounded-md border-[#ffffff] border h-11">
                 <input
  type={showPassword ? "text" : "password"}
  value={loginPassword}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginPassword(e.target.value)
  }
  className="outline-none bg-transparent px-2 text-[#ffffff] placeholder:text-[#ffffff] w-full"
  placeholder="Your Password..."
/>
                    <div className="ml-auto mr-2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                      <MdOutlineRemoveRedEye size={20} color="white" />
                    </div>
                  </div>
           {loginErrors.password && (
  <p className="text-red-500 text-xs mt-1">{loginErrors.password}</p>
)}
                  <h4 className="text-[#ffffff] font-bold text-[13px] ml-auto mt-2 cursor-pointer"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot Password?
                  </h4>
                </div>

</div>
  <div className="mt-3 flex flex-col  lg:w-full">
                  <button
                    type="submit"
                    className=" h-12 cursor-pointer bg-[#2ED843]  font-semibold rounded-2xl text-black duration-500 ease-in-out hover:bg-white hover:text-black border-2 border-transparent hover:border-black flex items-center justify-center"
                   
                  >
                    {isSubmitting ? <ClipLoader color='black' size={20} /> : "Login"}
                  </button>
                  <h4 className="text-[#ffffff] text-[13px] mt-2">
                    Don't have an account?{" "}
<span
  className="text-[#ffffff] font-bold cursor-pointer"
  onClick={() => setAccount('signup')}
>
  SignUp
</span>
                  </h4>
                </div>
</form>



<div className="flex flex-col gap-4">
<h4 className="text-[15px] font-normal text-[#ffffff] ">Log in with</h4>
<div className="flex items-center justify-center gap-4">
  <Image src={google} height={30} width={30} alt="Google" className="cursor-pointer"  onClick={signInWithGoogle} />
  or
  <Image src={facebook} height={30} width={30} alt="Facebook" className="cursor-pointer" onClick={handleFacebookLogin} />
   </div>
  </div>

</div>



      </div>
) : ( 

    <div className="h-screen w-screen flex flex-col justify-center items-center  "
       style={{
    backgroundImage: "url('signup.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
      >
        <div className=" bg-[#121417F2] backdrop-blur-sm px-6 py-6 justify-center items-center flex flex-col rounded-xl  lg:w-125 h-140 gap-9 w-[95%]">
<div className="flex flex-col items-center gap-1 justify-center">
<h3 className="font-bold text-[40px] text-[#FFFFFF] font-inter">Sign up</h3>

</div>



<form className="flex flex-col gap-4  items-center justify-center w-[90%]"
onSubmit={Handlesignup}
>
<div className="gap-4 flex flex-col w-full">

 <div>
   <div className="flex items-center pl-2 bg-[#121417F2] rounded-md border-[#ffffff] border h-11">
    <input
      value={fullName}
   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
      className="outline-none bg-transparent px-2 text-[#ffffff] placeholder:text-[#ffffff] d w-full"
      placeholder="Full Name"
    />
   </div>  
   {errors.fullName && (
     <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
   )}
 </div>

 <div>
   <div className="flex items-center pl-2 bg-[#121417F2] rounded-md border-[#ffffff] border h-11">
    <input
      value={email}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      className="outline-none bg-transparent px-2 text-[#ffffff] placeholder:text-[#ffffff] w-full"
      placeholder="Email"
    />
   </div>  
   {errors.email && (
     <p className="text-red-500 text-xs mt-1">{errors.email}</p>
   )}
 </div>

 <div>
   <div className="flex items-center pl-2 bg-[#121417F2] rounded-md border-[#ffffff] border h-11">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      className="outline-none bg-transparent px-2 text-[#ffffff] placeholder:text-[#ffffff] w-full"
      placeholder="Password"
    />
      <div className="ml-auto mr-2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                      <MdOutlineRemoveRedEye size={20} color="white" />
                    </div>
   </div>
   {errors.password && (
     <p className="text-red-500 text-xs mt-1">{errors.password}</p>
   )}
 </div>

</div>
  <div className="mt-3 flex flex-col  lg:w-full">
                  <button
                    type="submit"
                    className="  h-12 cursor-pointer bg-[#2ED843]  font-semibold rounded-2xl text-black duration-500 ease-in-out  hover:text-black border-2 border-transparent hover:border-black flex items-center justify-center"
                   
                  >
                    {isSubmitting ? <ClipLoader color='black' size={20} /> : "Sign Up"}
                  </button>
                  <h4 className="text-[#ffffff] text-[13px] mt-2">
                    Already have an account?{" "}
<span
  className="text-[#ffffff] font-bold cursor-pointer"
  onClick={() => setAccount('login')}
>
  Login
</span>
                  </h4>
                </div>
</form>



<div className="flex flex-col gap-4">
<h4 className="text-[15px] font-normal text-[#ffffff] "> Sign up with</h4>
<div className="flex items-center justify-center gap-4">
  <Image src={google} height={30} width={30} alt="Google" className="cursor-pointer" onClick={signInWithGoogle}/>
  or
  <Image src={facebook} height={30} width={30} alt="Facebook" className="cursor-pointer"  onClick={handleFacebookLogin}/>
   </div>
  </div>
</div>



      </div>
)
}
<Modal
  isOpen={showForgotModal}
  onRequestClose={() => setShowForgotModal(false)}
  className="bg-white w-[90%] max-w-md rounded-2xl p-6 outline-none"
  overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
>
  <div className="flex flex-col gap-4">

    <h2 className="text-xl font-bold text-black text-center">
      Forgot Password
    </h2>

    <p className="text-sm text-black text-center">
      Enter your email to receive a reset link
    </p>

    {/* Email Input */}
    <div className="w-full border border-[#2ED843] text-black p-3 rounded-lg flex">
    <input
      type="email"
      value={recoveryEmail}
      onChange={(e) => {
    setRecoveryEmail(e.target.value);
    if (recoveryError) setRecoveryError(null);
  }}
      placeholder="Email address"
      className=" outline-none w-full focus:border-none"
    />
      <div className="ml-auto mr-2 cursor-pointer">
                      <MdOutlineMail size={20} color="black" />
                    </div>
  </div>
{recoveryError && (
  <p className="text-red-500 text-sm mt-1">{recoveryError}</p>
)}
    {/* Buttons */}
    <div className="flex gap-3 mt-2">

      <button
        onClick={() => setShowForgotModal(false)}
        className="flex-1 py-3 rounded-lg bg-[#121417F2] text-white cursor-pointer "
      >
        Cancel
      </button>

      <button
        onClick={handleForgotPassword}
        className="flex-1 py-3 rounded-lg  text-black font-semibold cursor-pointer bg-[#2ED843]  "
      
      >
        {recoveryLoading ? <ClipLoader color='white' size={20} /> : "Send Link"}
      </button>

    </div>

  </div>
</Modal>
    </div>
  );
}
