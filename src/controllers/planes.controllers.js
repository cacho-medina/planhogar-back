export const getPlan = (req, res) => {
    try {
        res.status(200).json({ message: "PLanes" });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener los planes" });
    }
};
export const postPlan = (req, res) => {
    try {
        res.status(201).json({ message: "PLanes creado" });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener los planes" });
    }
};
export const putPlan = (req, res) => {
    try {
        res.status(200).json({ message: "PLanes" });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener los planes" });
    }
};
export const deletePlan = (req, res) => {
    try {
        res.status(200).json({ message: "PLanes" });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: "No se pudo obtener los planes" });
    }
};
