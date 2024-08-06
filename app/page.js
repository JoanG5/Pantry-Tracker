"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  query,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(docRef, {
        quantity: quantity + 1,
      });
      getInventory();
      handleClose();
    } else {
      await setDoc(docRef, {
        quantity: 1,
      });
      getInventory();
      handleClose();
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (confirm("Are you sure you want to delete this item?")) {
        await deleteDoc(docRef);
        getInventory();
      }
    }
  };

  const addQuantity = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(docRef, {
        quantity: quantity + 1,
      });
      getInventory();
    }
  };

  const removeQuantity = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        if (confirm("Are you sure you want to delete this item?")) {
          await deleteDoc(docRef);
        }
      } else {
        await updateDoc(docRef, {
          quantity: quantity - 1,
        });
        getInventory();
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      getInventory();
    }
    inventory.forEach((item) => {
      const filteredInventory = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setInventory(filteredInventory);
    });
  };

  useEffect(() => {
    getInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      // width="100vw"
      // height="100vh"
      display={"flex"}
      // justifyContent={"center"}
      alignItems={"center"}
      gap={2}
      flexDirection={"column"}
    >
      <Typography variant="h1" padding={5}>
        Welcome to Pantry Tracker
      </Typography>
      <Box display={"flex"} gap={2}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Box>

      <Box display={"flex"} gap={2}>
        <Button
          onClick={handleOpen}
          style={{
            backgroundColor: "blue",
            borderRadius: "5px",
            padding: "10px",
            color: "white",
            width: "800px",
          }}
        >
          Add Item
        </Button>
        <Modal open={open} onClose={handleClose}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100vh"}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={2}
              padding={2}
              border={"1px solid black"}
            >
              <TextField
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button onClick={() => addItem(itemName)}>Add</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      <Stack spacing={2} width="800px" overflow="auto">
        {inventory.map((item) => (
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            key={item.name}
            padding={2}
            border={"1px solid black"}
          >
            <Typography>{item.name}</Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Button onClick={() => addQuantity(item.name)}>+</Button>
              <Typography paddingX={1}>{item.quantity}</Typography>
              <Button onClick={() => removeQuantity(item.name)}>-</Button>
            </Box>
            <Button onClick={() => removeItem(item.name)}>Remove</Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
