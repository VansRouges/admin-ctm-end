"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CryptocurrenciesTab from "@/components/cryptocurrencies-tab";
import AdminCopyTrading from "@/components/copytrades-tab";
import LiveCryptoTab from "@/components/live-crypto-tab";

export default function ManageTabs() {
  const [activeTab, setActiveTab] = useState("cryptocurrencies");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-app-gold-100">
        <TabsTrigger
          className="overflow-hidden text-xs sm:text-base data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-app-gold-100/20 transition-all duration-200"
          value="cryptocurrencies"
        >
          Cryptocurrency
        </TabsTrigger>
        <TabsTrigger
          className="overflow-hidden text-xs sm:text-base data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-app-gold-100/20 transition-all duration-200"
          value="liveprices"
        >
          Live Prices
        </TabsTrigger>
        <TabsTrigger
          className="overflow-hidden text-xs sm:text-base data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-app-gold-100/20 transition-all duration-200"
          value="copytrades"
        >
          Copy Trades
        </TabsTrigger>
      </TabsList>
      <TabsContent value="cryptocurrencies" className="mt-6">
        <CryptocurrenciesTab />
      </TabsContent>
      <TabsContent value="liveprices" className="mt-6">
        <LiveCryptoTab />
      </TabsContent>
      <TabsContent value="copytrades" className="mt-6">
        <AdminCopyTrading />
      </TabsContent>
    </Tabs>
  );
}