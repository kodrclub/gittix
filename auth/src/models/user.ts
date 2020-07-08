import mongoose from 'mongoose'

/*
Describes the properties required to create a new user
*/
interface UserAttrs {
  email: string
  password: string
}
/*
Describes the properties that a User Document has
*/
interface UserDoc extends mongoose.Document {
  email: string
  password: string
}
/*
Describes the properties that a User Model has
*/
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
