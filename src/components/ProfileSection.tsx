import { useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";


type ProfileSectionProps = {
  userName: string;
  profileImage: string;
};

const ProfileSection = ({ userName, profileImage }: ProfileSectionProps) => {
  const [image, setImage] = useState(profileImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Simula o upload da imagem para um serviço de armazenamento (ex.: Cloudinary, S3)
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const { url } = await uploadResponse.json();

      // Atualiza a URL da foto de perfil no backend
      await api.put("/api/user/profile-image", { profileImage: url });

      setImage(url); // Atualiza a imagem no estado local
    } catch (error) {
      console.error("Erro ao atualizar a foto de perfil:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#50C2C9] w-full flex flex-col items-center py-6 px-4">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white relative">
        <Image
          src={image || "/default-profile.png"}
          alt="Profile Picture"
          width={128}
          height={128}
        />
        <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
          />
          <span className="text-xs text-black">{isUploading ? "..." : "Editar"}</span>
        </label>
      </div>
      <h1 className="text-white text-xl md:text-2xl font-semibold mt-4 text-center">
        Welcome <br /> {userName || "Guest"}
      </h1>
    </div>
  );
};

export default ProfileSection;
