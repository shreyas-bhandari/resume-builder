import React from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ShreyasTemplate from "./templates/ShreyasTemplate";

export default function ResumePreview({ data, template, accentColor }) {
  const props = { data, accentColor };

  switch (template) {
    case "modern":
      return <ModernTemplate {...props} />;
    case "minimal":
      return <MinimalTemplate {...props} />;
    case "shreyas":
      return <ShreyasTemplate {...props} />;
    case "classic":
    default:
      return <ClassicTemplate {...props} />;
  }
}
