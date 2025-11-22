export const validateAddItem = (req, res, next) => {
  const { item_name, price, quantity } = req.body;

  if (!item_name || typeof item_name !== "string" || item_name.trim() === "") {
    return res.status(400).json({message: "not appropriate"});
  }
  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({message: "not appropriate"});
  }
  if (typeof quantity !== "number" || quantity < 0) {
    return res.status(400).json({message: "not appropriate"});
  }

  next();
};

export const validateUpdateItem = (req, res, next) => {
  const id = Number(req.params.id); // cast to number
  const { item_name, price, quantity } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({message: "not appropriate"});
  if (!item_name || typeof item_name !== "string" || item_name.trim() === "") {return res.status(400).json({message: "not appropriate"});}
  if (typeof price !== "number" || price < 0) return res.status(400).json({message: "not appropriate"});
  if (typeof quantity !== "number" || quantity < 0) return res.status(400).json({message: "not appropriate"});

  next();
};

export const validateRemoveItem = (req, res, next) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) return res.status(400).json({message: "not appropriate"});

  next();
};
