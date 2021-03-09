import React, { useState } from "react";
import { NextPage } from 'next';
import { Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";


const ChangePassword : NextPage = () => {
  
  const router = useRouter();
  // console.log(router.query);
  const [, changePassword] = useChangePasswordMutation();
  const [ tokenError, setTokenError ] = useState('');

  return (
    <Wrapper variant="small">
    <Formik
      initialValues={{ newPassword: ""}}
      onSubmit={async (values, { setErrors }) => {
        const response = await changePassword({
          newPassword: values.newPassword,
          token: router.query.token === 'string' ? router.query.token : "",
        });
        if(response.data?.changePassword.errors) {
          const errorMap = toErrorMap(response.data.changePassword.errors);
          if('token' in errorMap) {
            setTokenError(errorMap.token);
          } 
           //seterror
           setErrors(errorMap);
        
        } else if (response.data?.changePassword.user) {
          //worked
          router.push("/");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField
            name="newPassword"
            placeholder="newPassword"
            label="newPassword"
            type="password"
          />
          { tokenError ?<Box color="red">{tokenError}</Box> : null}
          <Button
            mt={5}
            type="submit"
            isLoading={isSubmitting}
            variantColor="teal"
          >
            Login
          </Button>
        </Form>
      )}
    </Formik>
  </Wrapper>
  );
}

//@ts-ignore
export default withUrqlClient(createUrqlClient)(ChangePassword);
