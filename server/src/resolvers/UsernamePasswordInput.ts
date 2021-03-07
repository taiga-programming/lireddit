import {
  InputType,
  Field
} from "type-graphql";

/* define class types */


@InputType()
export class UsernamePasswordInput {
  @Field()
  email: string ;
  @Field()
  username: string ;
  @Field()
  password: string ;
}
