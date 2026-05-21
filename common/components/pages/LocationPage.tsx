import GoogleMaps from "../ui/location/GoogleMaps";

export default function LocationPage() {
    return ( 
        <div className="h-150 w-200 p-10 border border-white/10 rounded-lg bg-black/10 mt-4 backdrop-blur-md">
            <GoogleMaps />
        </div>
    );
}

