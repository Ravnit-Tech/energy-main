import Link from "next/link";
import Head from "next/head";
import Input from "../../components/Input";
import BookingLayout from "@/components/BookingLayout";
import Dropdown from "@/components/Dropdown";

export default function companyinfo() {
  return (
    <>
      <Head><title>Owner Info | e-Nergy</title></Head>
    <BookingLayout>
      <div className="min-h-fit w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {/* LEFT SIDE - HEADING */}
          <div className="flex flex-col justify-center order-1 lg:order-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              WELCOME TO <br />
              PIPES & BARRELS <br />
              OIL & GAS <br />
              BOOKING PAGE
            </h1>

            <p className="mt-6 md:mt-10 text-sm sm:text-base text-gray-600">
              Please be informed that booking within 48 hours from the period of
              booking.
            </p>

            <div className="mt-6 md:mt-10 space-y-4 md:space-y-10 text-sm sm:text-base">
              <p>📧 info@pipesandbarrels.com</p>
              <p>📞 (+234) 08087550875</p>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="space-y-3 md:space-y-5 order-2 lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
              Owner’s Information
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              Carefully fill in your company owner’s details into the columns
              provided.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <Input label="NAME" placeholder="enter your name" />
              <Input label="TELEPHONE" placeholder="(+234)" />
            </div>

            <Input label="ADDRESS" placeholder="enter your address" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <Input label="EMAIL" placeholder="enter your email" />
              <Dropdown
              label="DRIVER’S ID "
                options={["International passport", "Driver's license", "National ID"]}
                placeholder="Select type"
              />
            </div>

            <Input label="ID NUMBER" placeholder="enter selected ID number" />
            <div className="flex justify-between">
              <Link href="/bookings/companyinfo">← Back</Link>
              <Link href="/bookings/productbooking">Next →</Link>
            </div>
          </div>
        </div>
      </div>
    </BookingLayout>
    </>
  );
}
