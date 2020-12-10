import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, selectUsers } from "../slices/users";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

interface IProps {
  data: User[];
}

const IndexPage = ({ data }: IProps) => {
  console.log(data);

  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(selectUsers);

  useEffect(() => {
    async function dispatchGetUsers() {
      dispatch(getUsers());
    }
    dispatchGetUsers();
  }, [dispatch]);

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

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch("https://reqres.in/api/users?page=2");
  const { data } = await response.json();

  return {
    props: { data },
  };
};
export default IndexPage;
