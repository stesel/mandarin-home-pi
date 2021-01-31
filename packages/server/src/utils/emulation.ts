export function getIsPiEmulation() {
    return process.env.PI_MODE === "EMULATION";
}
