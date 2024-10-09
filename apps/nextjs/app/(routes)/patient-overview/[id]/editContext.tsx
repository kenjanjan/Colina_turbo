"use client";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

interface EditContextType {
  isEdit: boolean;
  isOpenHovered: boolean;
  toggleEdit: () => void;
  saveClicked: () => void;
  disableEdit: () => void;
  cancelClicked: () => void;
  isSave: number; // Define toggleEdit as a function that takes no arguments and returns void
}

const defaultValue: EditContextType = {
  isEdit: false,
  isOpenHovered: false,

  toggleEdit: () => {},
  cancelClicked: () => {},
  disableEdit: () => {},

  isSave: 0,
  saveClicked: () => {},
  // Set the default value of isEdit to false
};
//create the context first
export const EditContext = createContext(defaultValue);
// use the context passing the context as an argument
export const useEditContext = () => useContext(EditContext);
// create the provider to wrap the components that will use the context
export const EditProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenHovered, setIsOpenHovered] = useState(false);
  const [isSave, setIsSave] = useState(0);

  const toggleEdit = () => {
    setIsEdit((prev) => !prev);
    console.log("editcontext", isEdit);
    // setIsSave(false);
  };
  const disableEdit = () => {
    setIsEdit(false);
    console.log("restrictEdit", isEdit);
    // setIsSave(false);
  };

  const saveClicked = () => {
    setIsSave(isSave+1);


    console.log("setIsSave", isSave);
  };
  const cancelClicked = () => {
    // setIsSave(false);
    setIsEdit(false);

    console.log("setIsSave", isSave);
  };

  const isOpenHoveredClicked = () => {
    
    setIsEdit(false);

    console.log("setIsSave", isSave);
  };


  useEffect(() => {
    setIsSave(isSave);
    setIsEdit(isEdit);
    console.log("isEdit changed context:", isEdit);
    console.log("isSave changed context:", isSave);
  }, [isEdit, isSave]); // Include isEdit in the dependency array to ensure that the effect runs whenever the isEdit state changes

  return (
    //values to pass in the children when using the provider
    <EditContext.Provider
      value={{
        isEdit,
        isOpenHovered,
        toggleEdit,
        isSave,
        saveClicked,
        disableEdit,
        cancelClicked,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};
