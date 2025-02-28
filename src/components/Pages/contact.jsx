import { Nav } from "../Widgets/nav";
export function Contact() {
  return (
    <>
      <Nav />
      <div className="flex flex-col h-screen   text-center bg-[#666464]  text-white">
        <div className="flex flex-col pt-64 bg-[#2F4754] h-[40vh]"></div>
        <div className="flex flex-col pt-4 bg-[#161E22] h-[40vh] space-y-2">
          <div className="text-5xl font-bold ">Contact Us</div>
          <div className=" text-xl font-light">
            For further inquiries contact us <br /> on any of our handlings
            below!
          </div>
        </div>
        <div className="flex flex-row bg-[#D9D9D9] justify-evenly rounded-[30px] lg:w-1/2   -mt-32 mx-auto text-black pb-4">
          <div className="">
            <img
              src={`${process.env.PUBLIC_URL}/Mail.svg`}
              alt="Mail Icon"
              className="rounded-full border p-6 -mt-6 bg-orange-500 border-black"
            />
            <div className="">Email Address</div>
            <div className=""> Email@Uwi.edu</div>
          </div>
          <div className="">
            {" "}
            <img
              src={`${process.env.PUBLIC_URL}/Phone.svg`}
              alt="Mail Icon"
              className="rounded-full border p-6 -mt-6 bg-orange-500 border-black"/>
            <div className="">
              <div className="">Phone/Landline</div>
              <div className=""> +1868 --- ---- </div>
            </div>
          </div>
          <div className="">
            {" "}
            <img
              src={`${process.env.PUBLIC_URL}/mapPin.svg`}
              alt="Mail Icon"
              className="rounded-full border p-6 -mt-6 bg-orange-500 border-black"
            />
            <div className="">
              {" "}
              <div className="">Our Headoffice</div>
              <div className=""> Headoffice Location </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}