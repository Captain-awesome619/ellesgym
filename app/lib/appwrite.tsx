import { Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
    AppwriteException, } from "appwrite";

     export const appwriteConfig = {
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string,
        platform1:process.env.NEXT_PUBLIC_APPWRITE_PLATFORM1 as string,
        platform2:process.env.NEXT_PUBLIC_APPWRITE_PLATFORM2 as string,
        projectId:process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string,
        databaseId:process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        userCollectionId:process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID as string,  
         storageId:process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID as string,
      };
      const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
 export const accountt = new Account(client);
 export const avatars = new Avatars(client);
 export const databases = new Databases(client);
 export const storage = new Storage(client);

export async function createUser(
  email: string,
  password: string,
  fullname: string | undefined
) {
  try {
    // 1. Create account
    const newAccount = await accountt.create(
      ID.unique(),
      email,
      password,
      fullname
    );

    if (!newAccount) throw new Error("Account creation failed");

    // 2. Create session immediately (required for verification)
   await accountt.createEmailPasswordSession({
  email,
  password,
});

    // 3. Create user document in DB
    const avatarUrl = avatars.getInitials(fullname || "User");

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountid: newAccount.$id,
        email,
        fullname,
        avatar: avatarUrl,
      }
    );

    // 4. Send verification email (requires session)
  await accountt.createEmailVerification({
  url: "https://ellesgym.onrender.com/",
});

    // 5. OPTIONAL: log user out immediately if you don't want them signed in
    await accountt.deleteSession({
  sessionId: "current",
});

    return newUser;
  } catch (error) {
    console.error(error);

    if ((error as AppwriteException)?.code === 409) {
      alert("Email already exists. Please login instead.");
      throw new Error("Email already exists. Please login instead.");
    }

    throw error;
  }
}



export async function signIn(email: string, password: string) {
  try {
    // 1. Check if a session already exists
    try {
      await accountt.get(); // will succeed if logged in

      // If we reach here → session exists → delete it
      await accountt.deleteSession("current");
    } catch {
      // No active session → ignore
    }

    // 2. Create new session
    await accountt.createEmailPasswordSession({ email, password });

    // 3. Get user
    const user = await accountt.get();

    // 4. Check verification
    if (!user.emailVerification) {
      await accountt.deleteSession("current");

      alert("Please verify your email before logging in.");
      return null;
    }

    return user;

  } catch (error) {
    console.error(error);
    throw new Error("Invalid email or password");
  }
}
  export async function getAccount() {
    try {
      const currentAccount = await accountt.get();
  
      return currentAccount;
    } catch (error) {
    console.log(error)
    }
  }

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No account found");

    const currentUser = await databases.listDocuments({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.userCollectionId,
      queries: [
        Query.equal("accountid", currentAccount.$id),
      ],
    });

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("User not found");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}


 export const signInWithGoogle = () => {
  accountt.createOAuth2Session({
    provider: "google" as any,
    success: "https://ellesgym.onrender.com/success",
    failure: "https://ellesgym.onrender.com",
  });
};

export async function handleGoogleLogin() {
  const user = await accountt.get();

  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.$id,
      {
        accountid: user.$id,
        email: user.email,
        fullname: user.name,
      }
    );
  } catch (error: any) {
    // ignore duplicate error
    if (error.code !== 409) {
      throw error;
    }
  }

  return user;
}