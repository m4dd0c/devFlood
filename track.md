# Doubts

1. Theme.tsx (onClick function)
2. ThemeContext.tsx (handleChangeMode function)

# Remains

1. add fix types
2. FIX HYDRATION AND LINKING IN COMMUNITY USERCARD
3. FIX>>> jsonparse jsonstrigify in voting

# user type copied from other project for analysing

export interface IUser extends Document {
updatedAt: NativeDate;
createdAt: NativeDate;
chats: ObjectId[];
connections: ObjectId[];
projects: ObjectId[];
_id: ObjectId;
username: string;
full_name: string;
email: string;
password: string;
bio: string;
profile_pic: IProfilePic;
verification: IVerification;
reset_psk: IResetPsk;
role: "user" | "superuser";
genJWT: () => string | null;
comparePass: (password: string) => Promise<boolean>;
connectionCount: number;
}
