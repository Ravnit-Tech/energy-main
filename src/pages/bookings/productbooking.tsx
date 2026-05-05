import Link from "next/link";
import Head from "next/head";
import Input from "../../components/Input";
import BookingLayout from "@/components/BookingLayout";
import Dropdown from "@/components/Dropdown";

export default function productbooking() {
  return (
    <>
      <Head><title>Product Booking | e-Nergy</title></Head>
    <BookingLayout>
      <div className="min-h-full w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          {/* LEFT SIDE - HEADING */}
          <div className="flex flex-col justify-center order-1 lg:order-1 col-span-1 lg:col-span-1">
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

          {/* MIDDLE - FORM */}
          <div className="space-y-3 md:space-y-5 order-2 lg:order-2 col-span-1 lg:col-span-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
              owner&apos;s Information
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              Carefully fill in your company owner&apos;s details into the columns
              provided.
            </p>
<Dropdown
              label="PRODUCT TYPE"
              options={["PMS", "AGO", "DPK"]}
              placeholder="Select type"
            />
            <Dropdown
              label="PRODUCT QUANTITY"
              options={["33,000 liters", "45,000 liters", "60,000 liters", "100,000 liters"]}
              placeholder="select or manually enter a quantity"
            />

            <Dropdown
            label="HAULAGE TRUCK"
              options={["Owner truck", "Rent Truck"]}
              placeholder="Select type"
            />

            <Input label="DRIVER'S NAME" placeholder="enter driver's name" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <Dropdown
            label="DRIVER’S ID "
              options={["International passport", "Driver's license", "National ID"]}
              placeholder="Select type"
            />
            <Input label="ID NUMBER" placeholder="enter selected ID number" />
            </div>

            
            
            <div className="flex justify-between pt-6">
              <Link href="/bookings/companyinfo" className="text-blue-600 font-semibold hover:text-blue-800 transition">
                ← Back
              </Link>
              <Link href="/bookings/productbooking" className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Next →
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - TRUCK SELECTION */}
          <div className="order-3 lg:order-3 col-span-1 lg:col-span-1">
            <div className="flex justify-center items-center bg-gray-100 w-full h-60 sm:h-72 md:h-80 rounded-lg">
              <p className="text-sm sm:text-base md:text-lg text-gray-500 font-medium">
                No Truck selected
              </p>
            </div>
          </div>
        </div>
      </div>
    </BookingLayout>
    </>
  );
}
