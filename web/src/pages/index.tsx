import { NavBar } from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from "../generated/graphql";
import React from 'react';
import { Layout } from '../components/Layout';
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core';
import NextLink from "next/link";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  if(!fetching && !data ) {
    return <div>you got no posts for some reason</div>
  }

  return (
   <Layout>
    <Flex align='center'>
      <NextLink href='/create-post'>
        <Link ml='auto'>create post</Link>
      </NextLink>
    </Flex>
     <br/>
     {!data && !fetching ? (
       <div>loading....</div>
     ) : (
       //data! means (Not need to ask.value is already declared)
      <Stack spacing={8}>
        {data!.posts.map((p) => (
          <Box key={p.id} p={5} shadow="md" borderWidth="1px">
             <Heading fontSize="xl">{p.title}</Heading>
             textSnippet

              <Text mt={4}>{p.textSnippet}</Text>
             {/* <Text mt={4}>{p.text.slice(0, 50)}</Text> */}
          </Box>
      ))}
       </Stack>
     )}
     { data ? (<Flex>
        <Button m= "auto" isLoading={fetching} my={4}> load more</Button>
     </Flex>
     ): null }
     </Layout>
   
  );
};
export default  withUrqlClient(createUrqlClient, { ssr: true })(Index);