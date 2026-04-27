import { getAddress, isAddress, type Address } from "viem";
import { resolveEnsName } from "@/lib/rpc";
import type { InputType } from "@/lib/types";

export class AddressInputError extends Error {
  code = "INVALID_ADDRESS";
  status = 400;
}

export interface ResolvedInput {
  input: string;
  resolvedAddress: Address;
  inputType: InputType;
  displayAddress: string;
}

export async function resolveWalletInput(rawInput: string): Promise<ResolvedInput> {
  const input = rawInput.trim();

  if (!input) {
    throw new AddressInputError("Enter a Base wallet address or ENS name.");
  }

  if (isAddress(input)) {
    const resolvedAddress = getAddress(input);

    return {
      input,
      resolvedAddress,
      inputType: "address",
      displayAddress: resolvedAddress
    };
  }

  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(input)) {
    const address = await resolveEnsName(input);

    if (!address) {
      throw new AddressInputError("ENS name could not be resolved to an address.");
    }

    return {
      input,
      resolvedAddress: getAddress(address),
      inputType: "ens",
      displayAddress: input.toLowerCase()
    };
  }

  throw new AddressInputError("Invalid address format. Use a 0x wallet address or ENS name.");
}
