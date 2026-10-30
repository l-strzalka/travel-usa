import { z } from 'zod';

const hobbies = ['Programing', 'Weight lifting', 'Guitar'] as const;


const UserSchema = z.object({
  username: z.string(),
  age: z.number(),
  birthday: z.date(),
  isProgramer: z.boolean().default(true),
  test: z.undefined(),
  hobby: z.enum(hobbies),
}).pick({username: true});

type User = z.infer<typeof UserSchema>;

const user: User = {
  username: 'lukasz@wp.pl',
  age: 36,
  birthday: new Date(),
  isProgramer: true,
  test: undefined,
  hobby: 'Guitar',
};

console.log(UserSchema.parse(user));
