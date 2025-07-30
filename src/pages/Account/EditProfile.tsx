import React, { useEffect, useState, useRef } from "react";
import { APP_ENV } from "../../env";
import { useAppSelector, useAppDispatch } from "../../Store";
import { useNavigate } from "react-router-dom";
import { useEditProfileMutation, useGetFullNameQuery, useRefreshTokenMutation } from "../../Services/apiAccount";
import type { IEditProfile } from "../../Services/types.ts";
import { loginSuccess } from "../../Store/authSlice.ts";

const EditProfile = () => {
    const { data: fullName } = useGetFullNameQuery();
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [editProfile, { isLoading }] = useEditProfileMutation();
    const [refreshToken] = useRefreshTokenMutation();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [email, setEmail] = useState(user?.email || "");
    const [preview, setPreview] = useState<string | null>(
        user?.image ? `${APP_ENV.IMAGES_400_URL}${user.image}` : null
    );
    const [firstName, setFirstName] = useState(fullName?.firstName || "");
    const [lastName, setLastName] = useState(fullName?.lastName || "");

    useEffect(() => {
        if (fullName) {
            setFirstName(fullName.firstName);
            setLastName(fullName.lastName);
        }
      }, [fullName]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!firstName || !lastName || !email) return;

        const data: IEditProfile = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            image: imageFile? imageFile : undefined,
        };

        try {
            await editProfile(data).unwrap();
            const refresh = await refreshToken().unwrap();
            const { token } = refresh;
            dispatch(loginSuccess(token));
            navigate("/account");
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    return (
        <div>
            {user && (
                <div className="container mx-auto px-6 py-10 max-w-6xl flex flex-col items-center">
                    <div
                        className="relative w-full max-w-md group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img
                            src={preview || "/images/user/default.png"}
                            alt={user.name}
                            className="rounded-xl w-full h-96 object-cover border shadow-md border-amber-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-semibold">Upload Image</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="mt-6 w-full max-w-md space-y-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />

                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => navigate("/account")}
                            className="bg-gray-300 hover:bg-gray-400 text-black text-lg font-semibold px-6 py-3 rounded shadow transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`${
                                isLoading ? "bg-amber-300" : "bg-amber-500 hover:bg-amber-600"
                            } text-white text-lg font-semibold px-6 py-3 rounded shadow transition`}
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProfile;
