"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface FormValues {
  email: string;
  name: string;
  username: string;
  password: string;
}

const RegisterPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const imgBBKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const initialValues: FormValues = {
    email: "",
    name: "",
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Họ tên là bắt buộc"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    username: Yup.string().required("Tên người dùng là bắt buộc"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu là bắt buộc"),
  });

  const onSubmit = async (values: FormValues) => {
    let imageUrl: string | null = null;

    if (selectedImage) {
      const formData = new FormData();

      formData.append("image", selectedImage);

      const imgUploadResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgBBKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const imgData = await imgUploadResponse.json();

      if (imgData.success) {
        imageUrl = imgData.data.url;
      } else {
        console.error("Upload hình ảnh thất bại: ", imgData.message);
        toast.error("Đã xảy ra lỗi khi tải lên hình ảnh.");
      }
    }

    const body = {
      ...values,
      images: imageUrl
        ? imageUrl
        : "https://i.postimg.cc/vTc77cCR/z5754029748341-cc0fa001b45798c168a78d695e41479b.jpg",
    };

    try {
      const response = await axios.post("/api/register", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(response.data.message);

      setTimeout(() => router.push("/account/login"), 300);
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
      } else {
        toast.error("Đã xảy ra lỗi.");
      }
    }
  };

  return (
    <>
      <title>Đăng ký tài khoản - MUSIC MALL</title>

      <div className="flex items-center min-h-screen justify-center py-10">
        <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-lg rounded-lg">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Đăng Ký Tài Khoản
          </h2>

          <div className="text-center mb-6">
            <Button className="w-full bg-red-500 hover:bg-red-600">
              Đăng ký với Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Hoặc</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tải lên ảnh đại diện (không bắt buộc)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />

            {selectedImage && (
              <div className="mt-2">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                />
              </div>
            )}
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Họ Tên
                  </label>
                  <Field
                    id="name"
                    name="name"
                    as={Input}
                    className="mt-1 w-full"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    as={Input}
                    className="mt-1 w-full"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên người dùng
                  </label>
                  <Field
                    id="username"
                    name="username"
                    as={Input}
                    className="mt-1 w-full"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mật khẩu
                  </label>
                  <Field
                    id="password"
                    name="password"
                    as={Input}
                    type="password"
                    className="mt-1 w-full"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full mt-2 mb-0"
                    disabled={!isValid || isSubmitting}
                  >
                    Đăng ký
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <p className="mt-1 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/account/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
