<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EntryResource;
use App\Models\Entry;
use App\Models\EntryProduct;
use App\Models\Product;
use App\Models\Provider;
use Illuminate\Http\Request;

class EntryController extends Controller
{
    public function index()
    {
        return EntryResource::collection(Entry::with('provider','user.role')->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'invoice_number' => 'required|unique:entries,invoice_number',
                'provider_id' => 'required',
                'user_id' => 'required',
            ]);

            $provider = Provider::where('name',(trim($request['provider_id'])))->first();

            $reference = "Facture n°".trim($request['invoice_number']);

            $dateEntry = trim($request['date_entry']);

            if (empty($request['date_entry'])) {
                $dateEntry = date('Ymd');
            }

            $entry = Entry::create([
                'invoice_number' => $reference,
                'user_id' => trim($request['user_id']),
                'provider_id' => trim($provider->id),
                'date_entry' => $dateEntry,
            ]);

            return response()->json(['message' => 'entry created successfully', 'id' => $entry->id]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
         } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }

    }

    public function countIndexBetweenDates(Request $request)
    {
        try {
            $request->validate([
                'date1' => 'required',
                'date2' => 'required',
            ]);

            $startDate = new \DateTime(trim($request['date1']));
            $endDate = new \DateTime(trim($request['date2']));

            $entries = Entry::whereBetween('created_at', [$startDate, $endDate])->count();

            return new EntryResource($entries);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function indexBetweenDates(Request $request)
    {
        try {
            $request->validate([
                'start_date' => 'required',
                'end_date' => 'required',
            ]);

            $startDate = trim($request['start_date']);

            $endDate = trim($request['end_date']);

            if (strlen($startDate) === 10) {
                $startDate .= ' 00:00:00';
            }

            if (strlen($endDate) === 10) {
                $endDate .= ' 23:59:59';
            }

            $query = Entry::with('provider', 'user','entryproducts.product')->whereBetween('created_at', [$startDate, $endDate])->orderBy('created_at', 'desc');

            if ($request->has('user_id') && trim($request['user_id']) !== '') {
                $query->where('user_id', trim($request['user_id']));
            }

            return EntryResource::collection($query->get());

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

    public function show($id)
    {
        $entry = Entry::find($id);
        if (!$entry) {
            return response(['error' => 'entry not found'],404);
        }
        $entry->load('user.role','provider');
        return new EntryResource($entry);
    }

    public function update(Request $request, $id)
    {
        try {

            $entry = Entry::find($id);
            if (!$entry) {
                return response(['error' => 'entry not found'],404);
            }

            $request->validate([
                'invoice_number' => 'required',
                // 'user_id' => 'required|integer|unique:users,id',
                'provider_id' => 'required',
                'date_entry' => 'required',
            ]);

            $provider = Provider::where('name',(trim($request['provider_id'])))->first();
            $reference = "Facture n°".trim($request['invoice_number']);
            $entry->update([
                'invoice_number' => $reference ,
                'user_id' => trim($request['user_id']),
                'provider_id' => trim($provider->id),
                'date_entry' => trim($request['date_entry']),
            ]);

            return response()->json(['message' => 'entryProduct updated successfully'], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
