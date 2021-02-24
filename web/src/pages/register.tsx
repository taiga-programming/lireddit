import React from "react";
import { Formik, Form } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Button,
} from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

import { useRouter } from "next/router";


interface registerProps {}


/* conncet to database throgh graphql but not need to any more 

const REGISTER_MUT = `
mutation Register($username: String!, $password: String!){
  register(options:{ username: $username , password:$password}) {
    errors {
      field
      message
    }
    user {
      id 
      username
    }
  }
}
`;
*/

const Register: React.FC<registerProps> = ({}) => {

  /* before add graphql mutations
  const [,register] = useMutation(REGISTER_MUT);
  */

  const router = useRouter();

  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={ async (values, {setErrors}) => {
          const response = await register(values);
          
          //confirm error 
          if(response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            
            // console.log(response.data?.register.user);
            router.push("/");
          }

          /* 
            //confirm values whether actually working or not 
            console.log(values);
            register(values)
          */
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={5}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={5}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;