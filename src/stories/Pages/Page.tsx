import React from 'react';
import { HomePage } from "@/pages/HomePage"

type User = {
  name: string;
};

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>();

  return (
    <HomePage />
  )
};
