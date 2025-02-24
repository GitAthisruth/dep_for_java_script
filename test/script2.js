import express from "express";
import { Router } from "express";
import lodash, { debounce, throttle } from "lodash";
import { greetone } from "./script3"; 

export function greetTwo(name) {
    return `Hello, ${name}!`;
}
