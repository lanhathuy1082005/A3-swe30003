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
  const {id} = req.params; // cast to number
  const { item_name, price, quantity } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({message: "id not appropriate"});
  if (!item_name || typeof item_name !== "string" || item_name.trim() === "") {return res.status(400).json({message: "name not appropriate"});}
  if (typeof price !== "number" || price < 0) return res.status(400).json({message: "price not appropriate"});
  if (typeof quantity !== "number" || quantity < 0) return res.status(400).json({message: "quantity not appropriate"});

  next();
};

export const validateRemoveItem = (req, res, next) => {
  const {id} = req.params;
  if (!id || isNaN(id)) return res.status(400).json({message: "id not appropriate"});

  next();
};
