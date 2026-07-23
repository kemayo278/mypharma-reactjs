<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function index()
    {
        return CustomerResource::collection(Customer::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'first_name'        => ['required', 'string'],
                'matricule'         => ['nullable', 'string', 'unique:customers,matricule'],
                'is_prospect'       => ['sometimes', 'boolean'],
                'last_name'         => ['nullable', 'string'],
                'email'             => ['nullable', 'email'],
                'phone'             => ['nullable', 'string'],
                'date_of_birth'     => ['nullable', 'date'],
                'nationality'       => ['nullable', 'string'],
                'country_of_origin' => ['nullable', 'string'],
                'profession'        => ['nullable', 'string'],
                'employer'          => ['nullable', 'string'],
                'monthly_income'    => ['nullable', 'numeric'],
                'emergency_contact' => ['nullable', 'string'],
                'emergency_phone'   => ['nullable', 'string'],
                'status'            => ['nullable', 'string'],
                'contract_start'    => ['nullable', 'date'],
                'contract_end'      => ['nullable', 'date'],
                'payment_expiry'    => ['nullable', 'date'],
                'notes'             => ['nullable', 'string'],
                'documents'         => ['nullable', 'array'],
            ]);

            $data = $request->only([
                'first_name',
                'matricule',
                'is_prospect',
                'last_name',
                'email',
                'phone',
                'date_of_birth',
                'nationality',
                'country_of_origin',
                'profession',
                'employer',
                'monthly_income',
                'emergency_contact',
                'emergency_phone',
                'status',
                'contract_start',
                'contract_end',
                'payment_expiry',
                'notes',
                'documents',
            ]);

            $customer = Customer::create(array_filter($data, fn($value) => !is_null($value)));

            $customer = Customer::find($customer->id);

            return response()->json(['message' => 'customer created successfully', 'customer' => new CustomerResource($customer)]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }

    }

public function update(Request $request, string $id)
{
    try {
        $customer = Customer::findOrFail($id);

        $request->validate([
            'first_name'        => ['sometimes', 'string'],
            'matricule'         => ['nullable', 'string', Rule::unique('customers', 'matricule')->ignore($customer->id)],
            'is_prospect'       => ['sometimes', 'boolean'],
            'last_name'         => ['nullable', 'string'],
            'email'             => ['nullable', 'email'],
            'phone'             => ['nullable', 'string'],
            'date_of_birth'     => ['nullable', 'date'],
            'nationality'       => ['nullable', 'string'],
            'country_of_origin' => ['nullable', 'string'],
            'profession'        => ['nullable', 'string'],
            'employer'          => ['nullable', 'string'],
            'monthly_income'    => ['nullable', 'numeric'],
            'emergency_contact' => ['nullable', 'string'],
            'emergency_phone'   => ['nullable', 'string'],
            'status'            => ['nullable', 'string'],
            'contract_start'    => ['nullable', 'date'],
            'contract_end'      => ['nullable', 'date'],
            'payment_expiry'    => ['nullable', 'date'],
            'notes'             => ['nullable', 'string'],
            'documents'         => ['nullable', 'array'],
        ]);

        $data = $request->only([
            'first_name',
            'matricule',
            'is_prospect',
            'last_name',
            'email',
            'phone',
            'date_of_birth',
            'nationality',
            'country_of_origin',
            'profession',
            'employer',
            'monthly_income',
            'emergency_contact',
            'emergency_phone',
            'status',
            'contract_start',
            'contract_end',
            'payment_expiry',
            'notes',
            'documents',
        ]);

        $customer->update(array_filter($data, fn($value) => !is_null($value)));

        $customer = Customer::find($customer->id);

        return response()->json(['message' => 'customer updated successfully', 'customer' => new CustomerResource($customer)]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred while processing your request'], 500);
    }
}
}
