import axios from "axios";
import Swal from "sweetalert2";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRoute } from "../../utils/ApiRoutes";

const Login = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (localStorage.getItem("chat-user")) {
      navigate("/");
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    onSubmit: (values, { resetForm }) => {
      axios
        .post(loginRoute, {
          username: values.username,
          password: values.password,
        })
        .then((response) => {
          setMsg(response.data.msg);
          console.log(msg);
          const user = response.data.user;
          if (response.data.status) {
            Swal.fire({
              title: "Successfully",
              text: "¡Welcome!",
              icon: "success",
              confirmButtonColor: "#1d304b",
              confirmButtonText: "Entendido",
            }).then((result) => {
              localStorage.setItem("chat-user", JSON.stringify(user));
              if (result.isConfirmed) {
                navigate("/");
              }
            });
          } else {
            Swal.fire({
              title: `${msg}`,
              // text: "¡We will get in touch!",
              icon: "error",
              confirmButtonColor: "#8a1b1b",
              confirmButtonText: "Try again",
            }).then((result) => {
              if (result.isConfirmed) {
                // navigate("/");
              }
            });
          }
        })
        .catch((error) => console.log(error));
    },
  });
  return (
    <>
      <div className="bg-gray-800 flex h-screen w-screen justify-center items-center">
        <div className="h-5/5 w-3/5">
          <div className="">
            <div className="font-sans">
              <div className="relative flex flex-col sm:justify-center items-center">
                <div className="relative sm:max-w-sm w-full">
                  <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
                  <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
                  <div className="relative w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
                    <h1
                      for=""
                      className="block mt-3 text-2xl text-gray-700 text-center font-semibold"
                    >
                      LOGIN
                    </h1>
                    <form onSubmit={formik.handleSubmit}>
                      <div>
                        <input
                          name="username"
                          id="username"
                          onChange={formik.handleChange}
                          value={formik.values.username}
                          type="text"
                          placeholder="Username"
                          className="py-2 px-3 mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                        />
                      </div>

                      <div className="mt-7">
                        <input
                          name="password"
                          id="password"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          type="password"
                          placeholder="Password"
                          className="py-2 px-3 mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                        />
                      </div>

                      <div className="mt-7">
                        <button
                          type="submit"
                          className="bg-blue-500 font-semibold w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105"
                        >
                          LOGIN
                        </button>
                      </div>

                      <div className="mt-7">
                        <div className="flex justify-center items-center">
                          <label className="mr-2">DON´T HAVE AN ACCOUNT?</label>
                          <button
                            onClick={() => navigate("/register")}
                            className=" text-blue-500 transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105"
                          >
                            CREATE ONE
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
