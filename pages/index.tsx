import React from "react";
import { useSelector } from "react-redux";
import { fetchUsers, selectUsers } from "slices/users";
import { wrapper } from "store";
import { User } from "types/user";

interface IProps {
  data: User[];
}

const IndexPage = (_users: IProps) => {
  const { users, loading, error } = useSelector(selectUsers());

  console.log("State on client", { users, loading, error });

  if (loading === "loading") {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  return users.map((user) => {
    return <div key={user.id}>{user.email}</div>;
  });
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await store.dispatch(fetchUsers());

    console.log("State on server", store.getState());

    return {
      props: {},
    };
  }
);

export default IndexPage;
