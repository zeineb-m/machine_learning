import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import UsersTable from "@/components/UsersTable";
import React, { useState } from "react";
import AddUser from "./adduser";
import { motion } from "framer-motion"; 

export function Tables() {
  const [addUser, setAddUser] = useState(false);

  const toggleAddUser = () => {
    setAddUser(!addUser);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <motion.button
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        onClick={toggleAddUser}
        className="w-max px-6 py-3 bg-gradient-to-r from-green-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-purple-700 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {addUser ? "Hide Form" : "Add User"}
      </motion.button>

         {addUser ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
        >
          <AddUser />
        </motion.div>
      ) : (

          <Card className="shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader
              variant="gradient"
              color="gray"
              className="mb-8 p-6 bg-gradient-to-r from-green-600 to-purple-600"
            >
              <Typography variant="h5" color="white" className="font-bold">
                Users Table
              </Typography>
            </CardHeader>
            <CardBody className="px-0 pt-0 pb-2">
              <UsersTable />
            </CardBody>
          </Card>

      )}
    </div>
  );
}

export default Tables;