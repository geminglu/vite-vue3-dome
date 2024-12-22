import JSEncrypt from "jsencrypt";
import useUserStore from "@/store/modules/user";

/**
 * 加密
 * @param str
 * @returns
 */
export async function encrypt(str: string) {
  const userStore = useUserStore();
  const encrypt = new JSEncrypt({ default_key_size: "4096" });
  const key = userStore.publicKey || (await userStore.genPublicKey());
  encrypt.setPublicKey(key || "");

  return encrypt.encrypt(str);
}
