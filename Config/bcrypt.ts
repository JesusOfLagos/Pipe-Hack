import bcrypt from 'bcrypt';

export class Hasher {
  saltRounds = 10;

  public async HashData(password: string): Promise<any> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!hashedPassword) {
      return 
    }
    return hashedPassword;
  }

  public async CompareHashData(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return false;
    }
    return isMatch;
  }
}