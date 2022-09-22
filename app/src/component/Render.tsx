import React from "react";

interface ConditionalRenderProps {
  condition: boolean;
  onTrue: JSX.Element | null;
  onFalse: JSX.Element | null;
}

const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  onTrue,
  onFalse,
  condition,
}) => {
  if (condition) return onTrue;
  return onFalse;
};

export default ConditionalRender;
