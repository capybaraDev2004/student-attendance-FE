"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

type Props = { children: React.ReactNode };

// Component client để bọc ChakraProvider, tránh gọi hàm client từ server
export default function ChakraProviders({ children }: Props) {
	// Chakra UI v3 cần truyền system qua prop value
	return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}


