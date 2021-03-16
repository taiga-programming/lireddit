import { Box, IconButton, Flex } from '@chakra-ui/core';
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation, VoteMutationVariables } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

/*
export interface UseMutationState<Data = any, Variables = object> {
    fetching: boolean;
    stale: boolean;
    data?: Data;
    error?: CombinedError;
    extensions?: Record<string, any>;
    operation?: Operation<Data, Variables>;
}

export interface GraphQLRequest<Data = any, Variables = object> {
    key: number;
    query: DocumentNode | TypedDocumentNode<Data, Variables>;
    variables?: Variables;
  }

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;
*/

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<'updoot-loading'| 'downdoot-loading' | 'not-loading'>('not-loading');
  
  const [, vote] = useVoteMutation();
  // const [{ fetching, operation }, vote] = useVoteMutation();
  // console.log(operation?.variables?.value);
    return (
      <Box mr={4}>
      <IconButton 
        aria-label="chevron-up"
        icon="chevron-up" 
        onClick={async () => {
          setLoadingState('updoot-loading')
          await vote({
            postId: post.id,
            value: 1
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === "updoot-loading"}
        // isLoading={fetching && (operation?.variables as VoteMutationVariables)?.value === 1}
        />
      <Flex justify="center" mt={2} mb={2} >
        {post.points}
        </Flex>
        <Box></Box>
      <IconButton  
        aria-label="chevron-down" 
        icon="chevron-down" 
        onClick={async () => {
          setLoadingState('downdoot-loading')
          await vote({
            postId: post.id,
            value: -1
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === "downdoot-loading"}
        // isLoading={fetching && (operation?.variables as VoteMutationVariables)?.value === -1}

      />
    </Box>
    );
}