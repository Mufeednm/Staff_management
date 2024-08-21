import React from "react";
import { Formik, Field, Form } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import * as Yup from "yup";
import Select from "react-select";
import { deletestaff, updatestaff } from "../../../../api/admin_api";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  batch: Yup.array().min(1, "At least one batch is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
});

const EditAdvisor = ({
  selectedAdvisor,
  isEditModalOpen,
  closeEditModal,
  setSelectedAdvisor,
}) => {
  const batchOptions = [
    { value: "1", label: "Batch 1" },
    { value: "2", label: "Batch 2" },
    { value: "3", label: "Batch 3" },
    { value: "4", label: "Batch 4" },
    { value: "5", label: "Batch 5" },
    { value: "6", label: "Batch 6" },
    { value: "7", label: "Batch 7" },
    { value: "8", label: "Batch 8" },
  ];

  const initialValues = {
    name: selectedAdvisor?.name || "",
    batch:
      selectedAdvisor?.batch?.map((b) =>
        batchOptions.find((option) => option.value === b)
      ) || [],
    phone: selectedAdvisor?.phone || "",
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
        name: values.name,
        phone: String(values.phone),
        batch: values.batch.map((item) => item.value),
      };

      const response = await updatestaff(selectedAdvisor._id, data);

      toast.success(response?.data?.message);
      setSelectedAdvisor(null);
    } catch (error) {
      console.log("handleSubmit", error);
    }

    closeEditModal();
  };

  const handleDelete = async () => {
    try {
      const response = await deletestaff(selectedAdvisor._id);
      console.log(response);

      toast.success(response.data.message);
      setSelectedAdvisor(null);
      closeEditModal();
    } catch (error) {
      console.log("handleDelete", error);
      toast.error("Failed to delete advisor");
    }
  };

  return (
    <div>
      <Dialog
        open={isEditModalOpen}
        onClose={closeEditModal}
        className="relative z-20"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity duration-300 ease-out" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <DialogTitle
              as="h3"
              className="text-2xl font-semibold text-gray-900 p-6"
            >
              Edit Advisor
            </DialogTitle>

            <div className="p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className={`mt-1 block w-full border ${
                          errors.name && touched.name
                            ? "border-red-500"
                            : "border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                        } rounded-md shadow w-full py-2 px-4 text-gray-700`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Batch
                      </label>
                      <Select
                        isMulti
                        options={batchOptions}
                        value={values.batch}
                        onChange={(selectedOptions) =>
                          setFieldValue("batch", selectedOptions)
                        }
                        className={`mt-1 block w-full border ${
                          errors.batch && touched.batch
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm`}
                        classNamePrefix="select"
                      />
                      {errors.batch && touched.batch && (
                        <p className="text-red-500 text-sm">{errors.batch}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <Field
                        type="text"
                        name="phone"
                        className={`mt-1 block w-full border ${
                          errors.phone && touched.name
                            ? "border-red-500"
                            : "border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                        } rounded-md shadow w-full py-2 px-4 text-gray-700`}
                      />
                      {errors.phone && touched.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>

                    {/* Delete button  */}
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center transition-transform duration-300 transform hover:rotate-12"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default EditAdvisor;