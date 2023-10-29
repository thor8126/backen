import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (err) {
    console.log(err);
  }
};
