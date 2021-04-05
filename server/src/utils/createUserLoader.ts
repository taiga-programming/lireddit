import DataLoader from "dataloader";    
import { User } from "src/entities/User";

// [1, 78, 8, 9]
// [{id: 1, username: "ddd"}, same .....]
export const createUserLoader = () => 
  
  new DataLoader<string, User>(async (userIds) => {
   
    const users = await User.findByIds(userIds as string[]);
    const userIdToUser: Record<number, User> = {};

    users.forEach(u => {
      userIdToUser[u. id] = u;
    });
   

    const sortedUsers = userIds.map((userId: any) => userIdToUser[userId]);
    console.log("userIds", userIds);
    console.log("map", userIdToUser);
    console.log("sortedUsers", sortedUsers);
    return sortedUsers;
});

