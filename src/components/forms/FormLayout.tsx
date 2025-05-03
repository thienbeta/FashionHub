
import React, { useState } from "react";
import { FormSidebar } from "./FormSidebar";

interface FormLayoutProps {
  children: React.ReactNode;
  activeFormId?: string;
}

export const FormLayout = ({ children, activeFormId }: FormLayoutProps) => {
  const [selectedFormId, setSelectedFormId] = useState<string>(activeFormId || "");

  return (
    <div className="flex h-full">
      <FormSidebar activeFormId={selectedFormId} onFormSelect={setSelectedFormId} />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};
