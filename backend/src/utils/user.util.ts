type UserWithSensitiveFields = {
  password?: unknown;
  verificationExpiresAt?: unknown;
};

export function toPublicUser<T extends UserWithSensitiveFields>(user: {
  toObject: () => T;
}): Omit<T, "password" | "verificationExpiresAt"> {
  const publicUser = user.toObject();
  delete publicUser.password;
  delete publicUser.verificationExpiresAt;

  return publicUser as Omit<T, "password" | "verificationExpiresAt">;
}
